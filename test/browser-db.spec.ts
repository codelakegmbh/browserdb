import {BrowserDb, BrowserDbCollection} from '../src';

describe('local-database-tests', () => {
  describe('getName', () => {
    test('returns proper database name', () => {
      const databaseName = 'test-name';
      const database = new BrowserDb(databaseName);
      expect(database.getName()).toEqual(databaseName);
    });
  });

  describe('getCollection', () => {
    let database: BrowserDb;

    beforeAll(() => {
      database = new BrowserDb('bla');
    });

    test('returns a proper collection', () => {
      expect(database.getCollection('bar')).toBeInstanceOf(BrowserDbCollection);
    });

    test('returns the same collection on multiple calls with the same name', () => {
      const collection: BrowserDbCollection = database.getCollection('bar');
      const collectionSecondCall: BrowserDbCollection = database.getCollection('bar');
      expect(collection).toBe(collectionSecondCall);
    });

    test('returns the same collection on multiple calls with the same name if an intermediate collection had another name', () => {
      const collection: BrowserDbCollection = database.getCollection('foo');
      database.getCollection('bar');
      const collectionThirdCall: BrowserDbCollection = database.getCollection('foo');
      expect(collection).toBe(collectionThirdCall);
    });

    test('returned collection uses the provided name', () => {
      const collection: BrowserDbCollection = database.getCollection('bar');
      expect(collection.getName()).toBe('bar');
    });
  });

  describe('clear()', () => {
    test('clears all underlying collections', () => {
      const db = new BrowserDb('foo');
      db.getCollection('bar').insertItem(1);
      db.clear();
      const result = db.getCollection('bar').selectItems(() => true);
      expect(result.length).toBe(0);
    });

    test('drops all references', () => {
      const db = new BrowserDb('foo');
      const collection = db.getCollection('bar');
      db.clear();
      const collection2 = db.getCollection('bar');
      expect(collection).not.toBe(collection2);
    });
  });
});
