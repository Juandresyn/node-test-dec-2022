import { NextFunction, Request, Response, Router } from 'express';
import * as HttpStatus from 'http-status-codes';
import bcrypt from 'bcryptjs';
import config from '../config/config';
import { ApiResponseError } from '../resources/interfaces/ApiResponseError';
import { UserService } from '../services/users.service';
import { body, validationResult } from 'express-validator/check';
import { Logger, ILogger } from '../utils/logger';

const { errors } = config;
const logger: ILogger = new Logger(__filename);
const usersRouter: Router = Router();

usersRouter.post('/', async (req: Request, res: Response, next: NextFunction) => {
  logger.info(JSON.stringify(req.body));
  const userService = new UserService();

  try {
    const response = await userService.insert(req.body);

    // return 200 even if no user found. Empty array. Not an error
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

// on routes that end in /users
// -----------------------------
usersRouter.get('/', async (req: Request | any, res: Response, next: NextFunction) => {

    const userService = new UserService();

    try {
      const response = await userService.getAll();
      // return 200 even if no user found. Empty array. Not an error
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

// on routes that end in /users/:id
// --------------------------------------
// Note: This route is dynamic and goes at end because we don't want /profile to match this route (e.g. 'profile' considered as valid id). Order matters in expressjs.
usersRouter.route('/:id')
  .get(async (req: Request | any, res: Response, next: NextFunction) => {

    const userService = new UserService();
    try {
      const user = await userService.getById(req.params.id);

      // if user not found
      if (!user) {
        res.status(HttpStatus.NOT_FOUND).json({
          success: false,
          message: `${errors.entityNotFound}: user id`
        });
        return;
      }
      // return found user
      res.status(HttpStatus.OK).json({
        success: true,
        user: user
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
      body('name').optional().isLength({ min: 1 }),
      body('lastname').optional().isLength({ min: 1 }),
      body('dob').optional().isLength({ min: 8 }),
      body('id').optional().isLength({ min: 6 }),
    ],
    async (req: Request | any, res: Response, next: NextFunction) => {
      const validationErrors = validationResult(req);
      if (validationErrors.isEmpty()) {
        const userService = new UserService();
        try {
          const user = await userService.getById(req.params.id);
          // if user not found
          if (!user) {
            return res.status(HttpStatus.NOT_FOUND).json({
              success: false,
              message: `${errors.entityNotFound}: user id`
            });
          }

          // now update the user attributes according to req body
          if (req.body.name) user.name = req.body.name;
          if (req.body.lastname) user.lastname = req.body.lastname;
          if (req.body.dob) user.dob = req.body.dob;

          const updatedUser = await userService.update(user);
          return res.status(HttpStatus.OK).json({
            success: true,
            user: updatedUser
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

      const userService = new UserService();
      try {
        const user = await userService.getById(req.params.id);

        // if user not found
        if (!user) {
          res.status(HttpStatus.NOT_FOUND).json({
            success: false,
            message: `${errors.entityNotFound}: user id`
          });
          return;
        }

        await userService.delete(user);

        // return found user
        res.status(HttpStatus.OK).json({
          success: true,
          user: user,
          message: 'User deleted successfully'
        });

      } catch (err) { // db exception. example: wrong syntax of id e.g. special character
        const error: ApiResponseError = {
          code: HttpStatus.BAD_REQUEST,
          errorObj: err
        };
        next(error);
      }
    });

export default usersRouter;
