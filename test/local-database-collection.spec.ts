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
  let collection: LocalDatabaseCollection;

  beforeEach(() => {
    initializeLocalStorageMock();
    collection = (new LocalDatabase('test')).getCollection('foo');
  });

  describe('getName()', () => {
    test('returns the passed name', () => {
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
      expect(collection.collectionKey()).toBe('local-database[test][foo]');
    });
  });

  describe('insertItem(item: any)', () => {
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

  describe('selectItems<T = any>(predicate: (a: T) => boolean): T[]', () => {
    test('returns all inserted items', () => {
      collection.insertItem(4);
      collection.insertItem(6);
      collection.insertItem(5);
      
      expect(collection.selectItems(() => true)).toEqual([4, 6, 5]);
    });

    test('returns only the entries which fulfill the predicate', () => {
      collection.insertItem(4);
      collection.insertItem(6);
      collection.insertItem(5);
      collection.insertItem(17);
      collection.insertItem(-4);
      
      expect(collection.selectItems(x => x % 2 === 0)).toEqual([4, 6, -4]);
    });

    test('returns the same object that was inserted - check that the collection data is cached', () => {
      const obj = { };
      collection.insertItem(obj);

      expect(collection.selectItems(() => true)[0]).toBe(obj);
    });
  });

  describe('updateItems<T = any>(predicate: (item: T) => boolean, updater: (item: T) => T): T[]', () => {
    test('overwrites old items the fulfill the predicate with the new item returned by the updater', () => {
      collection.insertItem(4);
      collection.insertItem(5);
      collection.insertItem(6);
      collection.insertItem(7);
      collection.updateItems(x => x % 2 !== 0, x => x * 2);
      expect(collection.selectItems(() => true)).toEqual([4, 10, 6, 14]);
    });

    test('returns the modified items', () => {
      collection.insertItem(4);
      collection.insertItem(5);
      collection.insertItem(6);
      collection.insertItem(7);
      const updated = collection.updateItems(x => x % 2 !== 0, x => x * 2);
      expect(updated).toEqual([10, 14]);
    });

    test('updates the localStorage string', () => {
      collection.insertItem(4);
      collection.updateItems(x => true, x => x * 2);
      expect(window.localStorage.getItem(collection.collectionKey())).toBe('[8]')
    });
  });
});