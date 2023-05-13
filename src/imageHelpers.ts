import sharp from 'sharp';
import Axios from 'axios';

export async function downloadImage(url: string): Promise<Buffer> {
  const resp = await Axios({
    url,
    method: 'GET',
    responseType: 'arraybuffer',
  });
  return new Promise((resolve, reject) => {
    try {
      const buffer = Buffer.from(resp.data, 'utf-8');
      resolve(buffer);
    } catch (err) {
      reject(err);
    }
  });
}

export async function resizeImage(
  buffer: Buffer,
  width: number,
  height: number
): Promise<Buffer> {
  const resizeBuff = await sharp(buffer).resize({ width, height }).toBuffer();
  return resizeBuff;
}
