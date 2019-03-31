import {LocalDatabaseManager} from '../src/local-database-manager';
import {LocalDatabase} from '../src';

describe('local-database-manager-tests', () => {
  describe('getDatabase()', () => {
    let manager: LocalDatabaseManager;

    beforeAll(() => {
      manager = new LocalDatabaseManager();
    });

    test('returns a database instance', () => {
      const database = manager.getDatabase('moinsen');
      expect(database).toBeInstanceOf(LocalDatabase);
    });

    test('passes the provided database name to the database', () => {
      const database = manager.getDatabase('foo');
      expect(database.getName()).toBe('foo');
    });

    test('returns the same database instance on multiple calls', () => {
      const database = manager.getDatabase('moinsen');
      const databaseSecondCall = manager.getDatabase('moinsen');
      expect(database).toBe(databaseSecondCall);
    });

    test('returns the same database instance on multiple calls after switching given database name', () => {
      const database = manager.getDatabase('moinsen');
      manager.getDatabase('foo');
      const databaseThirdCall = manager.getDatabase('moinsen');
      expect(database).toBe(databaseThirdCall);
    });
  });
});
