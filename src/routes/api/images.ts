import express from 'express';
import validateMiddleware from '../../middleware/validate';
import cacheMiddleware from '../../middleware/cacheMiddleware';
import { resizeImage, downloadImage } from '../../imageHelpers';
import { ERROR } from '../../errors';

const images = express.Router();

const cacheDuration = 30;
images.use(cacheMiddleware(cacheDuration));
images.get('/', validateMiddleware, async (req, res) => {
  const { url, width, height } = req.query;

  console.info(`Request - ${JSON.stringify(req.query, null, 4)}`);

  let downloadedImage: Buffer | null = null;

  try {
    downloadedImage = await downloadImage(url as string);
  } catch (err) {
    return res
      .status(500)
      .send(
        `${ERROR.DOWNLOAD_ERROR} <br><br> ${(err as Error)?.message || ''}`
      );
  }

  try {
    console.info(`Resizing image - ${url}`);
    const resizedImageBuff: Buffer = await resizeImage(
      downloadedImage,
      Number(width),
      Number(height)
    );

    res.set({
      'Content-Type': 'image/png',
      'Content-Length': resizedImageBuff.length,
    });
    return res.status(200).send(resizedImageBuff);
  } catch (err) {
    return res
      .status(500)
      .send(`${ERROR.RESIZE_ERROR} <br><br> ${(err as Error)?.message || ''}`);
  }
});

export default images;
