import cities from './cities.json';

const capitals = new Set(
  '石家庄 太原 呼和浩特 沈阳 长春 哈尔滨 南京 杭州 合肥 福州 南昌 济南 郑州 武汉 长沙 广州 南宁 海口 成都 贵阳 昆明 拉萨 西安 兰州 西宁 银川 乌鲁木齐'.split(
    ' ',
  ),
);
const subprovincialCapitals = new Set('沈阳 长春 哈尔滨 南京 杭州 济南 武汉 广州 成都 西安'.split(' '));
const independentPlan = new Set('深圳 宁波 厦门 青岛 大连'.split(' '));
const logs = cities.map((city) => Math.log(city.gdp2025));
const minimum = Math.min(...logs),
  maximum = Math.max(...logs);
/** GDP uses only 2025 records. Administrative role points and weights are authored game rules. */
export const CITY_POOL = cities.map((city) => {
  const gdpScore = 10 + (90 * (Math.log(city.gdp2025) - minimum)) / (maximum - minimum);
  const statusScore = subprovincialCapitals.has(city.name)
    ? 100
    : independentPlan.has(city.name)
      ? 90
      : capitals.has(city.name)
        ? 80
        : 30;
  const status = subprovincialCapitals.has(city.name)
    ? '副省级省会'
    : independentPlan.has(city.name)
      ? '计划单列市'
      : capitals.has(city.name)
        ? '省会／首府'
        : '普通地级市';
  return { ...city, gdpScore, statusScore, status, score: Math.round(gdpScore * 0.8 + statusScore * 0.2) };
});
export type City = (typeof CITY_POOL)[number];
export const SCORE_VERSION = '2025-gdp80-status20-v1';
