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
  })
});
