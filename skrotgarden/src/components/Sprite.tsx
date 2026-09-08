import { useState, type CSSProperties } from 'react';
import { assetUrl, type ImgExt } from '../systems/assets.ts';

interface Props {
  /** Asset-namn utan filändelse, t.ex. "parts/wheel_cykel". */
  sprite: string;
  alt?: string;
  className?: string;
  style?: CSSProperties;
  width?: number;
  height?: number;
}

/** <img> som föredrar PNG men faller tillbaka på platshållar-SVG. */
export function Sprite({ sprite, alt = '', className, style, width, height }: Props) {
  const [ext, setExt] = useState<ImgExt>('png');
  return (
    <img
      src={assetUrl(sprite, ext)}
      alt={alt}
      className={className}
      style={style}
      width={width}
      height={height}
      draggable={false}
      onError={() => {
        if (ext === 'png') setExt('svg');
      }}
    />
  );
}
