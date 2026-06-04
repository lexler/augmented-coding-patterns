import { basePath } from "@/lib/config";
import styles from "./StaticMap.module.css";

interface StaticMapProps {
  version: string;
  alt: string;
}

export default function StaticMap({ version, alt }: StaticMapProps) {
  return (
    <div className={styles.mapContainer}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        className={styles.lightMap}
        src={`${basePath}/maps/diagram_${version}.png`}
        alt={alt}
      />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        className={styles.darkMap}
        src={`${basePath}/maps/diagram_${version}_black.png`}
        alt={alt}
      />
    </div>
  );
}
