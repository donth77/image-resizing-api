import express from 'express';
import cacheMiddleware from '../../middleware/cacheMiddleware';
import { isNumber } from '../../utils';
import { resizeImage, downloadImage } from '../../imageHelpers';
import { ERROR } from '../../errors';

const images = express.Router();

const cacheDuration = 60;
images.use(cacheMiddleware(cacheDuration));

images.get('/', async (req, res) => {
  const { url, width, height } = req.query;

  console.info(`Request - ${JSON.stringify(req.query, null, 4)}`);

  // Check if query paramters are valid
  if (!url || !width || !height) {
    return res.status(400).send(ERROR.MISSING_QUERY_PARAMS);
  }

  // Check if width and height are valid
  if (!isNumber(width.toString()) || !isNumber(height.toString())) {
    return res.status(400).send(ERROR.WIDTH_HEIGHT_INVALID);
  }

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
