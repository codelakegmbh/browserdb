import { LocalDatabaseCollection } from "../src";

describe('local-database-collection-tests', () => {
  describe('getName', () => {
    test('returns the passed name', () => {
      const collection = new LocalDatabaseCollection('foo');
      expect(collection.getName()).toBe('foo');
    })
  });
});