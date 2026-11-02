import { useEffect, useState } from 'react';
import { listRemotePostPaths } from '../github-manage';

export default function PostPicker() {
  const [paths, setPaths] = useState<string[]>([]);
  const [error, setError] = useState('');
  useEffect(() => {
    let active = true;
    listRemotePostPaths()
      .then((items) => {
        if (active) setPaths(items);
      })
      .catch((cause) => {
        if (active) setError(cause instanceof Error ? cause.message : '读取失败');
      });
    return () => {
      active = false;
    };
  }, []);
  return (
    <div className="editor-panel-content">
      <p className="editor-muted">
        包含公开文章和隐藏的草稿。打开后可编辑；在「文章属性」关闭草稿开关并保存，即可恢复显示。写入仍需站主授权。
      </p>
      {error && (
        <p className="editor-error" role="alert">
          {error}
        </p>
      )}
      {!paths.length && !error && <p>正在读取文章目录…</p>}
      {paths.map((path) => (
        <a key={path} className="editor-draft-row" href={`/editor/?edit=${encodeURIComponent(path)}`}>
          {path.slice('src/content/blog/'.length)}
        </a>
      ))}
    </div>
  );
}
