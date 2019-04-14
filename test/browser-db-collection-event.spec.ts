import { BrowserDb, BrowserDbCollection } from '../src';

describe('browser-db-collection-event-tests', () => {
  let collection: BrowserDbCollection;

  beforeEach(() => {
    const db = new BrowserDb('foo');
    db.clear();
    collection = db.getCollection('bar');
    collection.clear();
  });

  describe('on', () => {
    test('does not fail on invalid event', () => {
      expect(() => collection.on('dfghedt' as any, () => { })).not.toThrow();
    });
  });

  describe('insertion', () => {
    test('triggers on event', () => {
      let works = false;
      const cb = () => works = true;
      collection.on('insert', cb);
      collection.insertItem(1);
      expect(works).toBeTruthy();
    });

    test('passes the new item to the callback', () => {
      let works = false;
      const cb = (a: number) => works = a === 1;
      collection.on('insert', cb);
      collection.insertItem(1);
      expect(works).toBeTruthy();
    });

    test('passes the collection to the callback', () => {
      let works = false;
      const cb = (a: number, col: BrowserDbCollection) => works = col === collection;
      collection.on('insert', cb);
      collection.insertItem(1);
      expect(works).toBeTruthy();
    });
  });

  describe('update', () => {
    test('triggers on event', () => {
      let works = false;
      const cb = () => works = true;
      collection.insertItem(1);
      collection.on('update', cb);
      collection.updateItems(() => true, () => 2);
      expect(works).toBeTruthy();
    });

    test('does not trigger if no items were updated', () => {
      let works = true;
      const cb = () => works = false;
      collection.on('update', cb);
      collection.updateItems(() => true, () => 2);
      expect(works).toBeTruthy();
    });

    test('passes the updated items to the callback', () => {
      let numbers: number[] = [];
      const cb = (a: number[]) => numbers = a;
      collection.insertItem(1);
      collection.on('update', cb);
      collection.updateItems(() => true, () => 2);
      expect(numbers).toEqual([2]);
    });

    test('passes the collection to the callback', () => {
      let works = false;
      const cb = (a: number[], col: BrowserDbCollection) => works = col === collection;
      collection.insertItem(1);
      collection.on('update', cb);
      collection.updateItems(() => true, () => 2);
      expect(works).toBeTruthy();
    });
  });
});
