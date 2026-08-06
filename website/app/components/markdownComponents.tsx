import type { ComponentPropsWithoutRef } from "react";
import Image from "next/image";
import { basePath } from "@/lib/config";

const isExternal = (src: string) => /^https?:\/\//.test(src);

export function MarkdownImage({ src, alt }: ComponentPropsWithoutRef<"img">) {
  if (typeof src !== "string") return null;

  return (
    <Image
      src={isExternal(src) ? src : `${basePath}${src}`}
      alt={alt ?? ""}
      width={0}
      height={0}
      sizes="100vw"
      style={{ width: "100%", height: "auto" }}
    />
  );
}

export const markdownComponents = { img: MarkdownImage };
