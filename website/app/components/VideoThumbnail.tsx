import { getYouTubeId } from '@/lib/video-titles';
import styles from './VideoThumbnail.module.css';

interface VideoThumbnailProps {
  url: string;
  title: string;
  videoTitle?: string;
}

export default function VideoThumbnail({ url, title, videoTitle }: VideoThumbnailProps) {
  const videoId = getYouTubeId(url);
  if (!videoId) return null;

  const thumbnailUrl = `https://i.ytimg.com/vi/${videoId}/mqdefault.jpg`;
  const ariaLabel = videoTitle
    ? `Watch video: ${videoTitle}`
    : `Watch video: ${title}`;

  return (
    <a
      className={styles.thumbnail}
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={ariaLabel}
    >
      <span className={styles.imageWrapper}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className={styles.image}
          src={thumbnailUrl}
          alt=""
          loading="lazy"
          width={320}
          height={180}
        />
        <span className={styles.overlay} aria-hidden="true">
          <svg
            className={styles.playIcon}
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M8 5v14l11-7z" />
          </svg>
        </span>
      </span>
      {videoTitle && <span className={styles.caption}>{videoTitle}</span>}
    </a>
  );
}
