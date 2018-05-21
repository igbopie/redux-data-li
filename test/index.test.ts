import { generateActions, generateReducers, reduxApiAction } from '../src';

// TODO: Add more testcases
test('Redux data properties are exported', () => {
  expect(generateActions).toBeTruthy();
  expect(generateReducers).toBeTruthy();
  expect(reduxApiAction).toBeTruthy();
});
