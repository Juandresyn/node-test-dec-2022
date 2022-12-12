import { getManager, Repository } from 'typeorm';
import { Reservation } from '../entities/Reservation';
import { Logger, ILogger } from '../utils/logger';

export class ReservationService {

  reservationRepository: Repository<Reservation>;
  logger: ILogger;

  constructor() {
    this.logger = new Logger(__filename);
    this.reservationRepository = getManager().getRepository(Reservation);
  }

  /**
   * Creates an instance of Reservation.
   */
  instantiate(data: Object): Reservation | undefined {
    return this.reservationRepository.create(data);
  }

  /**
   * Inserts a new Reservation into the database.
   */
  async insert(data: Reservation): Promise<Reservation> {
    this.logger.info('Create a new Reservation', data);
    const newReservation = this.reservationRepository.create(data);
    return await this.reservationRepository.save(newReservation);
  }

  /**
   * Returns array of all reservations from db
   */
  async getAll(): Promise<Reservation[]> {
    return await this.reservationRepository.find({
      relations: ['car', 'user']
    });
  }

  /**
   * Returns a reservation by given id
   */
  async getById(id: string | number): Promise<Reservation> {
    this.logger.info('Fetching reservation by id: ', id);
    if (id) {
      return await this.reservationRepository.findOne(id, {
        relations: ['car', 'user']
      });
    }
    return Promise.reject(false);
  }

  /**
   * Updates a reservation
   */
  async update(reservation: Reservation): Promise<Reservation | undefined> {
    try {
      const updatedReservation = await this.reservationRepository.save(reservation);
      return updatedReservation;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  /**
   * Deletes a reservation by given id
   */
   async delete(reservation: Reservation): Promise<Reservation> {
    this.logger.info('Deleting reservation by id: ', reservation);
    if (reservation) {
      return await this.reservationRepository.remove(reservation);
    }
    return Promise.reject(false);
  }
}
