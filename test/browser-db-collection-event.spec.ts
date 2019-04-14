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

    test('returns true if listener adding is successful', () => {
      expect(collection.on('insert', () => { })).toBe(true);
      expect(collection.on('update', () => { })).toBe(true);
      expect(collection.on('delete', () => { })).toBe(true);
    });

    test('returns false if listener adding is fails', () => {
      expect(collection.on('sdfhgt' as any, () => { })).toBe(false);
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
      const cb = (_: number, col: BrowserDbCollection) => {
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
      });
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
      const cb = (_: number[], col: BrowserDbCollection) => {
        expect(col).toBe(collection);
        done();
      };
      collection.insertItem(1);
      collection.on('update', cb);
      collection.updateItems(() => true, () => 2);
    });
  });

  describe('deletion', () => {
    test('triggers on event async', (done) => {
      let works = false;
      const cb = () => {
        works = true;
        expect(works).toBeTruthy();
        done();
      };
      collection.insertItem(1);
      collection.on('delete', cb);
      collection.deleteItems(() => true);
      expect(works).toBe(false);
    });

    test('does not trigger if no items were deleted', (done) => {
      let works = true;
      const cb = () => works = false;
      collection.on('delete', cb);
      collection.deleteItems(() => true);
      setTimeout(() => {
        expect(works).toBe(true);
        done();
      });
    });

    test('passes the deleted items to the callback', (done) => {
      const cb = (numbers: number[]) => {
        expect(numbers).toEqual([1]);
        done();
      };
      collection.insertItem(1);
      collection.on('delete', cb);
      collection.deleteItems(() => true);
    });

    test('passes the collection to the callback', (done) => {
      const cb = (_: number[], col: BrowserDbCollection) => {
        expect(col).toBe(collection);
        done();
      };
      collection.insertItem(1);
      collection.on('delete', cb);
      collection.deleteItems(() => true);
    });
  });

  describe('clear', () => {
    test('triggers on event async', (done) => {
      let works = false;
      const cb = () => {
        works = true;
        expect(works).toBe(true);
        done();
      };
      collection.on('clear', cb);
      collection.clear();
      expect(works).toBe(false);
    });
  });

  describe('removeListener', () => {
    test('listener is not invoked after it has been removed', () => {
      const cb = () => fail('listener has been called');
      collection.on('insert', cb);
      collection.removeListener(cb);
      collection.insertItem(1);
    });
  });
});
