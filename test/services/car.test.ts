import { CarService } from '../../src/services/cars.service';
import { createConnection } from 'typeorm';

let db;

beforeAll(async () => {
  db = await createConnection();
})

afterAll(async () => {
  const carService = new CarService();
  const allCars = await carService.getAll();

  for (let i = 0; i < allCars.length; i++) {
    await carService.delete(allCars[i]);
  }

  await db.close();
})

test('The car construction should go accordingly to the parameters', async () => {
  const carService = new CarService();
  const carData: any = {
    id: "NOF123",
    maker: 'mercedes-benz',
    model: 2023,
    ref: 'GLC300',
    color: 'blue',
    milage: 31278
  };

  const newCar = await carService.insert(carData);

  expect(newCar.id).toBe(carData.id);
});

test('Updating the car should reflect the changes', async () => {
  const carService = new CarService();
  const carData: any = {
    id: "IFF123",
    maker: 'AUDI',
    model: 2020,
    ref: 'Q7',
    color: 'red',
    milage: 12345
  };
  const newCar = await carService.insert(carData);
  newCar.id = 'UUF098';
  const updatedCar = await carService.update(newCar);

  expect(updatedCar.id).toBe('UUF098');
});

test('Should return all cars', async () => {
  const carService = new CarService();
  const allCars = await carService.getAll();

  expect(allCars.length).toBe(2);
});

test('Should return car by license', async () => {
  const carService = new CarService();
  const car = await carService.getByLicense('NOF123');

  expect(car.ref).toBe('GLC300');
});

test('Should delete car', async () => {
  const carService = new CarService();
  const carData: any = {
    id: "TTT777",
    maker: 'MAZDA',
    model: 2016,
    ref: 'RX7',
    color: 'BLACK',
    milage: 45676
  };

  const newCar = await carService.insert(carData);
  expect(newCar.id).toBe('TTT777');

  await carService.delete(newCar);
  const car = await carService.getByLicense('TTT777');

  expect(car).toBe(undefined);
});
