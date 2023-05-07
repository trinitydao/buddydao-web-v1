'use client';

import type { SetOptional } from 'type-fest';
import type { ImageProps } from 'next/image';
import classNames from 'classnames';
import Image from 'next/image';
import { rgbDataURL } from '../Image';

export type AvatarProps = SetOptional<ImageProps, 'alt' | 'src'> & {
  size?: 'small' | 'medium' | 'large';
};

export function Avatar(props: AvatarProps) {
  const { size = 'medium', src, alt = 'avatar', className } = props;

  const realSize = {
    small: 40,
    medium: 60,
    large: 80,
  }[size];

  const placeholder = rgbDataURL(204, 204, 204);

  return (
    <Image
      className={classNames(styles.avatar, className)}
      width={realSize}
      height={realSize}
      src={src ?? placeholder}
      alt={alt}
      placeholder="blur"
      blurDataURL={placeholder}
    />
  );
}

const styles = {
  avatar: classNames('rounded-full'),
};
