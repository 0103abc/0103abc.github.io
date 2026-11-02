import { ARTICLE_KINDS, type ArticleKind } from '../new-article';

export default function NewArticlePanel({ onCreate }: { onCreate: (kind: ArticleKind) => void }) {
  return (
    <div className="editor-panel-content">
      <p className="editor-muted">选择文章类型。创建时会填入当前时间，之后仍可修改分类和日期。</p>
      {ARTICLE_KINDS.map(({ id, label, description }) => (
        <button type="button" key={id} className="editor-draft-row w-full text-left" onClick={() => onCreate(id)}>
          <strong>{label}</strong>
          <small>{description}</small>
        </button>
      ))}
    </div>
  );
}
