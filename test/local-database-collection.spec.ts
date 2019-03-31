import { LocalDatabaseCollection, LocalDatabase } from "../src";

function initializeLocalStorageMock() {
  let storage = { };

  spyOn(window.localStorage, 'setItem').and.callFake((key: string, value: string) => {
    storage[key] = value;
  });

  spyOn(window.localStorage, 'getItem').and.callFake((key: string) => {
    return storage[key];
  });

  return storage;
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

  describe('insertItem(item: any)', () => {
    let storage: { [key: string]: string };
    let collection: LocalDatabaseCollection;

    beforeEach(() => {
      storage = initializeLocalStorageMock();
      collection = (new LocalDatabase('test')).getCollection('bla');
    });

    test('creates an array for the collection', () => {
      collection.insertItem(null);
      const localString = window.localStorage.getItem(collection.collectionKey());
      expect(JSON.parse(localString)).toBeInstanceOf(Array);
    });

    test('local collection contains the inserted item', () => {
      collection.insertItem(4);
      const localString = window.localStorage.getItem(collection.collectionKey());
      const parsedArray = JSON.parse(localString);
      expect(parsedArray[0]).toBe(4);
    });

    test('local collection keeps old item on new insertion', () => {
      collection.insertItem(4);
      collection.insertItem(6);
      const localString = window.localStorage.getItem(collection.collectionKey());
      const parsedArray = JSON.parse(localString);
      expect(parsedArray[0]).toBe(4);
    });
  });
});