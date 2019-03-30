import {LocalDatabaseManager} from '../src/local-database-manager';
import {LocalDatabase} from '../src';

describe('local-database-manager-tests', () => {
  describe('getDatabase', () => {
    test('returns a database instance', () => {
      const database = LocalDatabaseManager.getDatabase('moinsen');
      expect(database).toBeInstanceOf(LocalDatabase);
    });

    test('passes the provided database name to the database', () => {
      const database = LocalDatabaseManager.getDatabase('foo');
      expect(database.getName()).toBe('foo');
    });

    test('returns the same database instance on multiple calls', () => {
      const database = LocalDatabaseManager.getDatabase('moinsen');
      const databaseSecondCall = LocalDatabaseManager.getDatabase('moinsen');
      expect(database).toBe(databaseSecondCall);
    });

    test('returns the same database instance on multiple calls after switching given database name', () => {
      const database = LocalDatabaseManager.getDatabase('moinsen');
      LocalDatabaseManager.getDatabase('foo');
      const databaseThirdCall = LocalDatabaseManager.getDatabase('moinsen');
      expect(database).toBe(databaseThirdCall);
    });
  });
});
