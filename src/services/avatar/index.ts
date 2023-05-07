// 使用 canvas
export const createAvatar = (str: string) => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  if (!ctx) throw new Error('createAvatar: ctx is null');

  canvas.width = 80;
  canvas.height = 80;
  const color = createColor(str);
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, 80, 80);

  return canvas.toDataURL('image/png');
};

// 根据字符串生成随机颜色
const createColor = (str: string) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  let color = '#';
  for (let i = 0; i < 3; i++) {
    let value = (hash >> (i * 8)) & 0xff;
    color += ('00' + value.toString(16)).substr(-2);
  }
  return color;
};
