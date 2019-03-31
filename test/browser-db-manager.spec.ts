import {BrowserDbManager} from '../src/browser-db-manager';
import {BrowserDb} from '../src';

describe('local-database-manager-tests', () => {
  describe('getDatabase()', () => {
    let manager: BrowserDbManager;

    beforeAll(() => {
      manager = new BrowserDbManager();
    });

    test('returns a database instance', () => {
      const database = manager.getDatabase('moinsen');
      expect(database).toBeInstanceOf(BrowserDb);
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

  describe('getInstance()', () => {
    test('provides a global manager instance', () => {
      const manager = BrowserDbManager.getInstance();
      expect(manager).toBeInstanceOf(BrowserDbManager);
    });

    test('returns the same instance', () => {
      const manager = BrowserDbManager.getInstance();
      const manager2 = BrowserDbManager.getInstance();
      expect(manager).toBe(manager2);
    });
  })
});
