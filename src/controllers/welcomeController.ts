import { Request, Response } from 'express';
import * as HttpStatus from 'http-status-codes';

import config from '../config/config';

const { messages } = config;

/**
 * Controller to handle / GET request, show API information
 *
 *
 * @param {Request} req
 * @param {Response} res
 */
const welcomeController = (req: Request, res: Response) => {
  return res.status(HttpStatus.OK).json({
    name: req.app.locals.name,
    message: messages.helloWorld,
    version: req.app.locals.version,
  });
};

export default welcomeController;
