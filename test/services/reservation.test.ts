import { createConnection } from 'typeorm';

import { CarService } from '../../src/services/cars.service';
import { ReservationService } from '../../src/services/reservations.service';
import { UserService } from '../../src/services/users.service';

let db;

let car;
let user;

beforeAll(async () => {
  db = await createConnection();

  const carService = new CarService();
  const userService = new UserService();
  const userData: any = {
    id: 1234567890,
    name: 'Walter',
    lastname: 'White',
    dob: '1973-06-12',
  };
  const carData: any = {
    id: 'NOF123',
    maker: 'mercedes-benz',
    model: 2023,
    ref: 'GLC300',
    color: 'blue',
    milage: 31278,
  };

  user = await userService.insert(userData);
  car = await carService.insert(carData);
});

afterAll(async () => {
  const reservationService = new ReservationService();
  const carService = new CarService();
  const userService = new UserService();
  const allReservation = await reservationService.getAll();
  const allCars = await carService.getAll();
  const allUsers = await userService.getAll();

  for (let i = 0; i < allReservation.length; i++) {
    await reservationService.delete(allReservation[i]);
  }

  for (let i = 0; i < allCars.length; i++) {
    await carService.delete(allCars[i]);
  }

  for (let i = 0; i < allUsers.length; i++) {
    await userService.delete(allUsers[i]);
  }

  await db.close();
});

test('The reservation construction should go accordingly to the parameters', async () => {
  const reservationService = new ReservationService();
  const reservationData: any = {
    userId: car.carId,
    carId: user.client,
    from: '2022-12-10 10:00:00',
    to: '2022-12-20 11:00:00',
    notes: 'Lorem ipsum dolor sit amet',
  };

  const newReservation = await reservationService.insert(reservationData, car.carId, user.client);
  const reservation = await reservationService.getById(newReservation.id);

  expect(reservation.user.client).toBe(reservationData.userId);
  expect(reservation.car.carId).toBe(reservationData.carId);

  await reservationService.delete(reservation);
});

test('Updating the reservation should reflect the changes', async () => {
  const reservationService = new ReservationService();
  const reservationData: any = {
    userId: car.carId,
    carId: user.client,
    from: '2022-12-10 10:00:00',
    to: '2022-12-20 11:00:00',
    notes: 'Lorem ipsum dolor sit amet',
  };
  const newReservation = await reservationService.insert(reservationData, car.carId, user.client);
  newReservation.from = '2022-12-14 09:00:00';
  const updatedReservation = await reservationService.update(newReservation);

  expect(updatedReservation.from).toBe(newReservation.from);

  await reservationService.delete(newReservation);
});

test('Should return all reservations', async () => {
  const reservationService = new ReservationService();
  const reservationData: any = {
    userId: car.carId,
    carId: user.client,
    from: '2022-12-10 10:00:00',
    to: '2022-12-20 11:00:00',
    notes: 'Lorem ipsum dolor sit amet',
  };

  const newReservation = await reservationService.insert(reservationData, car.carId, user.client);
  const allReservations = await reservationService.getAll();

  expect(allReservations.length).toBe(1);

  await reservationService.delete(newReservation);
});

test('Should return reservation by id', async () => {
  const reservationService = new ReservationService();

  const reservationData: any = {
    userId: car.carId,
    carId: user.client,
    from: '2022-12-10 10:00:00',
    to: '2022-12-20 11:00:00',
    notes: 'Lorem ipsum dolor sit amet',
  };

  const newReservation = await reservationService.insert(reservationData, car.carId, user.client);
  const reservation = await reservationService.getById(newReservation.id);

  expect(reservation.user.name).toBe('Walter');

  await reservationService.delete(newReservation);
});

test('Should delete reservation', async () => {
  const reservationService = new ReservationService();
  const reservationData: any = {
    userId: car.carId,
    carId: user.client,
    from: '2022-12-10 10:00:00',
    to: '2022-12-20 11:00:00',
    notes: 'Lorem ipsum dolor sit amet',
  };

  const newReservation = await reservationService.insert(reservationData, car.carId, user.client);
  const reservationId = newReservation.id;

  expect(newReservation.user.name).toBe('Walter');

  await reservationService.delete(newReservation);
  const reservation = await reservationService.getById(reservationId);

  expect(reservation).toBe(undefined);
});
