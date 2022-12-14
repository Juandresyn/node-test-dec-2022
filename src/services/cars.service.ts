import { getManager, Repository } from 'typeorm';

import { Car } from '../entities/Car';
import { Logger, ILogger } from '../utils/logger';

export class CarService {
  carRepository: Repository<Car>;
  logger: ILogger;

  constructor() {
    this.logger = new Logger(__filename);
    this.carRepository = getManager().getRepository(Car);
  }

  /**
   * Creates an instance of Car.
   */
  instantiate(data: object): Car | undefined {
    return this.carRepository.create(data);
  }

  /**
   * Inserts a new Car into the database.
   */
  async insert(data: Car): Promise<Car> {
    this.logger.info('Create a new car', data);
    const newCar = this.carRepository.create(data);
    return await this.carRepository.save(newCar);
  }

  /**
   * Returns array of all cars from db
   */
  async getAll(): Promise<Car[]> {
    return await this.carRepository.find();
  }

  /**
   * Returns a car by given id
   */
  async getById(carId: string | number): Promise<Car> {
    this.logger.info('Fetching car by id: ', carId);
    if (carId) {
      return await this.carRepository.findOne(carId);
    }
    return Promise.reject(false);
  }

  /**
   * Returns a car by License
   */
  async getByLicense(id: string): Promise<Car | undefined> {
    const cars = await this.carRepository.find({
      where: { id },
    });
    if (cars && cars.length > 0) {
      return cars[0]; // typeorm find() returns array even if response is single object
    } else {
      return undefined;
    }
  }

  /**
   * Updates a car
   */
  async update(car: Car): Promise<Car | undefined> {
    try {
      const updatedCar = await this.carRepository.save(car);
      return updatedCar;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  /**
   * Deletes a car
   */
  async delete(car: Car): Promise<Car> {
    this.logger.info('Deleting car by id: ', car);
    if (car) {
      return await this.carRepository.remove(car);
    }
    return Promise.reject(false);
  }
}
