import { Request, Response, NextFunction } from 'express';
import { ERROR } from '../errors';
import { isNumber } from '../utils';

const validateMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { url, width, height } = req.query;
  // Check if query paramters are valid
  if (!url || !width || !height) {
    return res.status(400).send(ERROR.MISSING_QUERY_PARAMS);
  }

  // Check if width and height are valid
  if (!isNumber(width.toString()) || !isNumber(height.toString())) {
    return res.status(400).send(ERROR.WIDTH_HEIGHT_INVALID);
  }

  next();
};

export default validateMiddleware;
