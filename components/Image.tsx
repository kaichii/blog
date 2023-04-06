import { NotionImageProps } from '@/lib/types';
import Image from 'next/image';

export default function WrappedImage({
  src,
  alt,
  width,
  height,
  className,
  blurDataURL,
  style,
  priority,
  onLoad,
  placeholder,
}: NotionImageProps) {
  return (
    <Image
      className={className}
      src={src}
      alt={alt}
      width={width}
      height={height}
      blurDataURL={blurDataURL}
      priority={priority}
      style={style}
      onLoad={onLoad}
      placeholder={placeholder}
    />
  );
}
