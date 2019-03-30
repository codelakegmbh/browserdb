import {LocalDatabase, LocalDatabaseCollection} from '../src';

describe('local-database-tests', () => {
  describe('getName', () => {
    test('returns proper database name', () => {
      const databaseName = 'test-name';
      const database = new LocalDatabase(databaseName);
      expect(database.getName()).toEqual(databaseName);
    });
  });

  describe('getCollection', () => {
    let database: LocalDatabase;

    beforeAll(() => {
      database = new LocalDatabase('bla');
    });

    test('returns a proper collection', () => {
      expect(database.getCollection('bar')).toBeInstanceOf(LocalDatabaseCollection);
    });

    test('returns the same collection on multiple calls with the same name', () => {
      const collection: LocalDatabaseCollection = database.getCollection('bar');
      const collectionSecondCall: LocalDatabaseCollection = database.getCollection('bar');
      expect(collection).toBe(collectionSecondCall);
    });

    test('returns the same collection on multiple calls with the same name if an intermediate collection had another name', () => {
      const collection: LocalDatabaseCollection = database.getCollection('foo');
      database.getCollection('bar');
      const collectionThirdCall: LocalDatabaseCollection = database.getCollection('foo');
      expect(collection).toBe(collectionThirdCall);
    });

    test('returned collection uses the provided name', () => {
      const collection: LocalDatabaseCollection = database.getCollection('bar');
      expect(collection.getName()).toBe('bar');
    });
  })
});
