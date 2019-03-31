import { LocalDatabaseCollection } from "../src";

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
  describe('getName', () => {
    test('returns the passed name', () => {
      const collection = new LocalDatabaseCollection('foo');
      expect(collection.getName()).toBe('foo');
    });
  });

  describe('insertItem', () => {
    beforeEach(() => {
      initializeLocalStorageMock();
    });
  });
});