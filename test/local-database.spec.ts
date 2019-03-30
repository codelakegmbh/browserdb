import { LocalDatabase } from "../src/local-database";

describe('local-database-tests', () => {
  describe('getName', () => {
    test('returns proper database name', () => {
      const databaseName = 'test-name';
      const database = new LocalDatabase(databaseName);
      expect(database.getName()).toEqual(databaseName);
    });
  });
});
