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
    test('triggers on event async', (done) => {
      let works = false;
      const cb = () => {
        works = true;
        expect(works).toBeTruthy();
        done();
      };
      collection.on('insert', cb);
      collection.insertItem(1);
      expect(works).toBe(false);
    });

    test('passes the new item to the callback', (done) => {
      const cb = (a: number) => {
        expect(a).toBe(1);
        done();
      };
      collection.on('insert', cb);
      collection.insertItem(1);
    });

    test('passes the collection to the callback', (done) => {
      let works = false;
      const cb = (a: number, col: BrowserDbCollection) => {
        expect(col).toBe(collection);
        done();
      };
      collection.on('insert', cb);
      collection.insertItem(1);
    });
  });

  describe('update', () => {
    test('triggers on event async', (done) => {
      let works = false;
      const cb = () => {
        works = true;
        expect(works).toBeTruthy();
        done();
      };
      collection.insertItem(1);
      collection.on('update', cb);
      collection.updateItems(() => true, () => 2);
      expect(works).toBe(false);
    });

    test('does not trigger if no items were updated', (done) => {
      let works = true;
      const cb = () => works = false;
      collection.on('update', cb);
      collection.updateItems(() => true, () => 2);
      setTimeout(() => {
        expect(works).toBeTruthy();
        done();
      }, 20);
    });

    test('passes the updated items to the callback', (done) => {
      const cb = (numbers: number[]) => {
        expect(numbers).toEqual([2]);
        done();
      };
      collection.insertItem(1);
      collection.on('update', cb);
      collection.updateItems(() => true, () => 2);
    });

    test('passes the collection to the callback', (done) => {
      const cb = (a: number[], col: BrowserDbCollection) => {
        expect(col).toBe(collection);
        done();
      };
      collection.insertItem(1);
      collection.on('update', cb);
      collection.updateItems(() => true, () => 2);
    });
  });
});
