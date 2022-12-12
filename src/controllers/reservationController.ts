import { NextFunction, Request, Response, Router } from 'express';
import * as HttpStatus from 'http-status-codes';
import config from '../config/config';
import { ApiResponseError } from '../resources/interfaces/ApiResponseError';
import { ReservationService } from '../services/reservations.service';
import { CarService } from '../services/cars.service';
import { UserService } from '../services/users.service';
import { body, validationResult } from 'express-validator/check';
import { Logger, ILogger } from '../utils/logger';

const { errors } = config;
const logger: ILogger = new Logger(__filename);
const reservationsRouter: Router = Router();

reservationsRouter.post('/', async (req: Request, res: Response, next: NextFunction) => {
  logger.info(JSON.stringify(req.body));
  const reservationService = new ReservationService();
  try {
    const response = await reservationService.insert(req.body, req.body.carId, req.body.userId);

    // return 200 even if no reservation found. Empty array. Not an error
    res.status(HttpStatus.OK).json({
      success: true,
      reservation: response
    });
  } catch (err) {
    const error: ApiResponseError = {
      code: HttpStatus.BAD_REQUEST,
      errorObj: err
    };
    next(error);
  }
});

// on routes that end in /reservations
// -----------------------------
reservationsRouter.get('/', async (req: Request | any, res: Response, next: NextFunction) => {

    const reservationService = new ReservationService();

    try {
      const response = await reservationService.getAll();
      // return 200 even if no reservation found. Empty array. Not an error
      res.status(HttpStatus.OK).json({
        success: true,
        data: response
      });
    } catch (err) {
      const error: ApiResponseError = {
        code: HttpStatus.BAD_REQUEST,
        errorObj: err
      };
      next(error);
    }
  });

// on routes that end in /reservations/:id
// --------------------------------------
reservationsRouter.route('/:id')
  .get(async (req: Request | any, res: Response, next: NextFunction) => {

    const reservationService = new ReservationService();
    try {
      const reservation = await reservationService.getById(req.params.id);

      // if reservation not found
      if (!reservation) {
        res.status(HttpStatus.NOT_FOUND).json({
          success: false,
          message: `${errors.entityNotFound}: reservation id`
        });
        return;
      }
      // return found reservation
      res.status(HttpStatus.OK).json({
        success: true,
        reservation: reservation
      });

    } catch (err) { // db exception. example: wrong syntax of id e.g. special character
      const error: ApiResponseError = {
        code: HttpStatus.BAD_REQUEST,
        errorObj: err
      };
      next(error);
    }
  })

  .put(
    [
      body('userId').optional().isLength({ min: 5 }),
      body('carId').optional().isLength({ min: 6 }),
      body('from').optional().isLength({ min: 1 }),
      body('to').optional().isLength({ min: 1 }),
      body('notes').optional().isLength({ min: 1 })
    ],
    async (req: Request | any, res: Response, next: NextFunction) => {
      const validationErrors = validationResult(req);
      if (validationErrors.isEmpty()) {
        const reservationService = new ReservationService();
        const carService = new CarService();
        const userService = new UserService();

        try {
          const reservation = await reservationService.getById(req.params.id);
          // if reservation not found
          if (!reservation) {
            return res.status(HttpStatus.NOT_FOUND).json({
              success: false,
              message: `${errors.entityNotFound}: reservation id`
            });
          }

          // now update the reservation attributes according to req body
          if (req.body.userId) reservation.user = await userService.getById(req.body.userId);
          if (req.body.carId) reservation.car = await carService.getById(req.body.carId);
          if (req.body.from) reservation.from = req.body.from;
          if (req.body.to) reservation.to = req.body.to;
          if (req.body.notes) reservation.to = req.body.to;

          const updatedReservation = await reservationService.update(reservation);
          return res.status(HttpStatus.OK).json({
            success: true,
            reservation: updatedReservation
          });
        } catch (err) {
          // db errors e.g. unique constraints etc
          const error: ApiResponseError = {
            code: HttpStatus.BAD_REQUEST,
            errorObj: err
          };
          next(error);

          return null;
        }
      } else {  // validation errors
        const error: ApiResponseError = {
          code: HttpStatus.BAD_REQUEST,
          errorsArray: validationErrors.array()
        };
        next(error);

        return null;
      }
    })

    .delete(async (req: Request | any, res: Response, next: NextFunction) => {

      const reservationService = new ReservationService();
      try {
        const reservation = await reservationService.getById(req.params.id);

        // if reservation not found
        if (!reservation) {
          res.status(HttpStatus.NOT_FOUND).json({
            success: false,
            message: `${errors.entityNotFound}: reservation id`
          });
          return;
        }

        await reservationService.delete(reservation);

        // return found reservation
        res.status(HttpStatus.OK).json({
          success: true,
          reservation: reservation,
          message: 'Reservation deleted successfully'
        });

      } catch (err) { // db exception. example: wrong syntax of id e.g. special character
        const error: ApiResponseError = {
          code: HttpStatus.BAD_REQUEST,
          errorObj: err
        };
        next(error);
      }
    });

export default reservationsRouter;
