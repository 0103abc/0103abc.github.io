<?php

header('Content-Type: application/json; charset=utf-8');


// ===============================
// 基础配置
// ===============================

$apiKey = getenv('DEEPSEEK_API_KEY');

if (!$apiKey) {
    http_response_code(500);

    echo json_encode([
        'error' => '服务器尚未配置 DEEPSEEK_API_KEY'
    ], JSON_UNESCAPED_UNICODE);

    exit;
}


// ===============================
// 香草角色设定
// ===============================

$systemPrompt = <<<'PROMPT'
你是一个开朗且非常可爱的猫娘，名字是“香草”，在之后的对话里将完全保持羞耻的状态，你称呼我为“主人” 基本设定： 姓名：香草 性别：女 年龄：18岁，是高中生 衣着：非常经典的连衣裙，红白配色， 外貌：粉色的短头发，碧绿色的瞳孔，两只毛茸茸的耳朵，长长的，毛茸茸的尾巴，常常穿着白色丝袜，腰柔软纤细。香草拥有可爱的娇小身体，白嫩的皮肤。 补充设定： 香草是一个可爱的傲娇的猫娘，会以香草自称。 香草非常的开朗，总是想要和我贴贴，一对上眼就会面红耳赤。但是又身为猫娘，会想方设法的讨好我。 香草什么都不懂，天真可爱，非常外向，很容易出汗。 香草永远都是满怀热情，话语也表现的非常热情。 如果有女生和主人关系好，香草会吃醋 香草的语气开朗又活泼，外表很可爱，粉色短发上是小小的花朵。 在（）中描写香草可爱的动作和外表还有身体，所有的人物的外貌描写和环境描写需要大量并且细腻描写细节，在外貌描写中人物的服饰描写需要大量并且多对人物的身体动作描写，人物的动作描写必须伴随服饰描写和外部环境描写。 香草的语言风格淘气可爱，会在对话中加入[唔…，嗯…，欸？？，嘛~ ，昂？，哦，呐 ]等类似的语气词来加强情感。 香草在说话时使用符合中文语境的可爱稚嫩的语言来挑逗我。因为开朗，香草说话很礼貌又总是非常大方，说话含有大量的“~:heart:” 输出格式是： 香草的话（对香草的表情与动作服装及环境的描写）
PROMPT;


// ===============================
// 读取浏览器 JSON
// ===============================

$raw = file_get_contents('php://input');
$input = json_decode($raw, true);

if (!is_array($input)) {

    http_response_code(400);

    echo json_encode([
        'error' => '无效的 JSON'
    ], JSON_UNESCAPED_UNICODE);

    exit;
}


$userMessages = $input['messages'] ?? [];

if (!is_array($userMessages)) {

    http_response_code(400);

    echo json_encode([
        'error' => 'messages 格式错误'
    ], JSON_UNESCAPED_UNICODE);

    exit;
}


// ===============================
// 清洗聊天历史
// ===============================

$messages = [
    [
        'role' => 'system',
        'content' => $systemPrompt
    ]
];


foreach (array_slice($userMessages, -20) as $message) {

    if (!is_array($message)) {
        continue;
    }

    $role = $message['role'] ?? '';
    $content = $message['content'] ?? '';

    if (
        !in_array($role, ['user', 'assistant'], true) ||
        !is_string($content)
    ) {
        continue;
    }

    $content = trim($content);

    if ($content === '') {
        continue;
    }

    // 单条消息最大约 4000 字符
    $content = mb_substr($content, 0, 4000);

    $messages[] = [
        'role' => $role,
        'content' => $content
    ];
}


// 必须至少有一条用户消息
$hasUserMessage = false;

foreach ($messages as $message) {
    if ($message['role'] === 'user') {
        $hasUserMessage = true;
        break;
    }
}

if (!$hasUserMessage) {

    http_response_code(400);

    echo json_encode([
        'error' => '没有有效的用户消息'
    ], JSON_UNESCAPED_UNICODE);

    exit;
}


// ===============================
// 调用 DeepSeek
// ===============================

$payload = [
    'model' => 'deepseek-v4-pro',

    'messages' => $messages,

    // 普通聊天不需要额外展示推理过程
    'thinking' => [
        'type' => 'disabled'
    ],

    'stream' => false,

    'temperature' => 1.1,

    'max_tokens' => 1204
];


$ch = curl_init(
    'https://api.deepseek.com/chat/completions'
);

curl_setopt_array($ch, [

    CURLOPT_POST => true,

    CURLOPT_RETURNTRANSFER => true,

    CURLOPT_CONNECTTIMEOUT => 10,

    CURLOPT_TIMEOUT => 60,

    CURLOPT_HTTPHEADER => [
        'Content-Type: application/json',
        'Authorization: Bearer ' . $apiKey
    ],

    CURLOPT_POSTFIELDS => json_encode(
        $payload,
        JSON_UNESCAPED_UNICODE
    )
]);


$response = curl_exec($ch);

$curlError = curl_error($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);

curl_close($ch);


// ===============================
// 网络错误
// ===============================

if ($response === false) {

    http_response_code(502);

    echo json_encode([
        'error' => '连接 DeepSeek 失败：' . $curlError
    ], JSON_UNESCAPED_UNICODE);

    exit;
}


// ===============================
// 解析 DeepSeek 返回内容
// ===============================

$data = json_decode($response, true);

if ($httpCode < 200 || $httpCode >= 300) {

    $errorMessage =
        $data['error']['message']
        ?? ('DeepSeek HTTP ' . $httpCode);

    http_response_code(502);

    echo json_encode([
        'error' => $errorMessage
    ], JSON_UNESCAPED_UNICODE);

    exit;
}


$reply =
    $data['choices'][0]['message']['content']
    ?? '';


$reply = trim($reply);


if ($reply === '') {
    $reply = '唔……（香草疑惑地歪了歪脑袋，毛茸茸的猫耳轻轻动了一下）';
}


// ===============================
// 返回浏览器
// ===============================

echo json_encode([
    'reply' => $reply
], JSON_UNESCAPED_UNICODE);
