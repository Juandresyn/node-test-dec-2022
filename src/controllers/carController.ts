import { NextFunction, Request, Response, Router } from 'express';
import { body, validationResult } from 'express-validator/check';
import * as HttpStatus from 'http-status-codes';

import config from '../config/config';
import { ApiResponseError } from '../resources/interfaces/ApiResponseError';
import { CarService } from '../services/cars.service';
import { Logger, ILogger } from '../utils/logger';

const { errors } = config;
const logger: ILogger = new Logger(__filename);
const carsRouter: Router = Router();

carsRouter.post('/', async (req: Request, res: Response, next: NextFunction) => {
  logger.info(JSON.stringify(req.body));
  const carService = new CarService();

  try {
    const response = await carService.insert(req.body);

    // return 200 even if no car found. Empty array. Not an error
    res.status(HttpStatus.OK).json({
      success: true,
      data: response,
    });
  } catch (err) {
    const error: ApiResponseError = {
      code: HttpStatus.BAD_REQUEST,
      errorObj: err,
    };
    next(error);
  }
});

// on routes that end in /cars
// -----------------------------
carsRouter.get('/', async (req: Request | any, res: Response, next: NextFunction) => {
  const carService = new CarService();

  try {
    const response = await carService.getAll();
    // return 200 even if no car found. Empty array. Not an error
    res.status(HttpStatus.OK).json({
      success: true,
      data: response,
    });
  } catch (err) {
    const error: ApiResponseError = {
      code: HttpStatus.BAD_REQUEST,
      errorObj: err,
    };
    next(error);
  }
});

// on routes that end in /cars/:id
// --------------------------------------
carsRouter
  .route('/:id')
  .get(async (req: Request | any, res: Response, next: NextFunction) => {
    const carService = new CarService();
    try {
      const car = await carService.getById(req.params.id);

      // if car not found
      if (!car) {
        res.status(HttpStatus.NOT_FOUND).json({
          success: false,
          message: `${errors.entityNotFound}: car id`,
        });
        return;
      }
      // return found car
      res.status(HttpStatus.OK).json({
        success: true,
        car: car,
      });
    } catch (err) {
      // db exception. example: wrong syntax of id e.g. special character
      const error: ApiResponseError = {
        code: HttpStatus.BAD_REQUEST,
        errorObj: err,
      };
      next(error);
    }
  })

  .put(
    [
      body('id').optional().isLength({ min: 6 }),
      body('maker').optional().isLength({ min: 1 }),
      body('model').optional().isLength({ min: 4 }),
      body('ref').optional().isLength({ min: 1 }),
      body('color').optional().isLength({ min: 3 }),
      body('milage').optional().isLength({ min: 1 }),
    ],
    async (req: Request | any, res: Response, next: NextFunction) => {
      const validationErrors = validationResult(req);
      if (validationErrors.isEmpty()) {
        const carService = new CarService();
        try {
          const car = await carService.getById(req.params.id);
          // if car not found
          if (!car) {
            return res.status(HttpStatus.NOT_FOUND).json({
              success: false,
              message: `${errors.entityNotFound}: car id`,
            });
          }

          // now update the car attributes according to req body
          if (req.body.id) car.id = req.body.id;
          if (req.body.maker) car.maker = req.body.maker;
          if (req.body.model) car.model = req.body.model;
          if (req.body.ref) car.ref = req.body.ref;
          if (req.body.color) car.color = req.body.color;
          if (req.body.milage) car.milage = req.body.milage;

          const updatedCar = await carService.update(car);
          return res.status(HttpStatus.OK).json({
            success: true,
            car: updatedCar,
          });
        } catch (err) {
          // db errors e.g. unique constraints etc
          const error: ApiResponseError = {
            code: HttpStatus.BAD_REQUEST,
            errorObj: err,
          };
          next(error);

          return null;
        }
      } else {
        // validation errors
        const error: ApiResponseError = {
          code: HttpStatus.BAD_REQUEST,
          errorsArray: validationErrors.array(),
        };
        next(error);

        return null;
      }
    },
  )

  .delete(async (req: Request | any, res: Response, next: NextFunction) => {
    const carService = new CarService();
    try {
      const car = await carService.getById(req.params.id);

      // if car not found
      if (!car) {
        res.status(HttpStatus.NOT_FOUND).json({
          success: false,
          message: `${errors.entityNotFound}: car id`,
        });
        return;
      }

      await carService.delete(car);

      // return found car
      res.status(HttpStatus.OK).json({
        success: true,
        car: car,
        message: 'Car deleted successfully',
      });
    } catch (err) {
      // db exception. example: wrong syntax of id e.g. special character
      const error: ApiResponseError = {
        code: HttpStatus.BAD_REQUEST,
        errorObj: err,
      };
      next(error);
    }
  });

export default carsRouter;
