import { UserService } from '../../src/services/users.service';
import { createConnection } from 'typeorm';

let db;

beforeAll(async () => {
  db = await createConnection();
})

afterAll(async () => {
  const userService = new UserService();
  const allUsers = await userService.getAll();

  for (let i = 0; i < allUsers.length; i++) {
    await userService.delete(allUsers[i]);
  }

  await db.close();
})

test('The User construction should go accordingly to the parameters', async () => {
  const userService = new UserService();
  const userData: any = {
    id: 1234567890,
    name: 'Walter',
    lastname: 'White',
    dob: '1973-06-12'
  };

  const newUser = await userService.insert(userData);

  expect(newUser.name).toBe(userData.name);
});

test('Updating the user should reflect the changes', async () => {
  const userService = new UserService();
  const userData: any = {
    id: Math.floor(Math.random() * 1000000000),
    name: 'Walter',
    lastname: 'White',
    dob: '1973-06-12'
  };
  const newUser = await userService.insert(userData);
  newUser.name = 'Skyler';
  const updatedUser = await userService.update(newUser);

  expect(updatedUser.name).toBe('Skyler');
});

test('Should return all users', async () => {
  const userService = new UserService();
  const allUsers = await userService.getAll();

  expect(allUsers.length).toBe(2);
});

test('Should return user by id', async () => {
  const userService = new UserService();
  const user = await userService.getByCedula(1234567890);

  expect(user.name).toBe('Walter');
});

test('Should delete user', async () => {
  const userService = new UserService();
  const userData: any = {
    id: 1231231231,
    name: 'Delete',
    lastname: 'ThisUser',
    dob: '1993-07-13'
  };

  const newUser = await userService.insert(userData);
  expect(newUser.name).toBe('Delete');

  await userService.delete(newUser);
  const user = await userService.getByCedula(1231231231);

  expect(user).toBe(undefined);
});
