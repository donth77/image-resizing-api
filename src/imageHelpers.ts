import sharp from 'sharp';

export async function resize(
  filePath: string,
  newFilePath: string,
  width: number,
  height: number
) {
  await sharp(filePath)
    .resize(Number(width), Number(height))
    .toFile(newFilePath);
}

export function isFileExtSupported(ext: string) {
  return ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext);
}
