import { LocalDatabaseCollection, LocalDatabase } from "../src";

function initializeLocalStorageMock() {
  let storage = { };

  spyOn(window.localStorage, 'setItem').and.callFake((key: string, value: string) => {
    storage[key] = value;
  });

  spyOn(window.localStorage, 'getItem').and.callFake((key: string) => {
    return storage[key];
  });
}

describe('local-database-collection-tests', () => {
  describe('getName()', () => {
    test('returns the passed name', () => {
      const collection = new LocalDatabaseCollection(null, 'foo');
      expect(collection.getName()).toBe('foo');
    });
  });

  describe('getDatabase()', () => {
    test('returns the passed name', () => {
      const db = new LocalDatabase('moin');
      const collection = new LocalDatabaseCollection(db, 'foo');
      expect(collection.getDatabase()).toBe(db);
    });
  });

  describe('collectionKey()', () => {
    test('returns the properly prefixed key', () => {
      const db = new LocalDatabase('test');
    const collection = db.getCollection('bar');

    expect(collection.collectionKey()).toBe('local-database[test][bar]');
    });
  });

  describe('insertItem()', () => {
    beforeEach(() => {
      initializeLocalStorageMock();
    });
  });
});