import { LocalDatabse } from "..";

describe('local-database-tests', () => {
  describe('getName', () => {
    const databaseName = 'test-name';
    const database = new LocalDatabse(databaseName);
    beforeEach(() => {

    });

    test('returns proper database name', () => {
      expect(database.getName()).toBe(databaseName);
    });
  });
});