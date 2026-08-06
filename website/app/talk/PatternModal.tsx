import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { markdownComponents } from "@/app/components/markdownComponents";
import styles from "./PatternModal.module.css";
import detailStyles from "../pattern-detail.module.css";

interface PatternModalProps {
  pattern: {
    title: string;
    content: string;
    category: string;
    slug: string;
    emojiIndicator?: string;
  };
  onClose: () => void;
}

export default function PatternModal({ pattern, onClose }: PatternModalProps) {
  const getCategoryClass = () => {
    if (pattern.category === 'patterns') return 'patterns';
    if (pattern.category === 'anti-patterns') return 'antiPatterns';
    if (pattern.category === 'obstacles') return 'obstacles';
    return 'patterns';
  };

  const getCategoryLabel = () => {
    if (pattern.category === 'patterns') return 'Pattern';
    if (pattern.category === 'anti-patterns') return 'Anti-Pattern';
    if (pattern.category === 'obstacles') return 'Obstacle';
    return 'Pattern';
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose} aria-label="Close">
          ×
        </button>
        <header className={detailStyles.header}>
          <div className={detailStyles.titleWrapper}>
            {pattern.emojiIndicator && (
              <div className={detailStyles.emoji}>{pattern.emojiIndicator}</div>
            )}
            <h1 className={detailStyles.title}>{pattern.title}</h1>
          </div>
          <span className={`${detailStyles.category} ${detailStyles[getCategoryClass()]}`}>
            {getCategoryLabel()}
          </span>
        </header>
        <article className={detailStyles.content}>
          <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
            {pattern.content}
          </ReactMarkdown>
        </article>
      </div>
    </div>
  );
}
