import { BrowserDb, BrowserDbCollection } from '../src';

describe('browser-db-collection-event-tests', () => {
  let collection: BrowserDbCollection;

  beforeEach(() => {
    const db = new BrowserDb('foo');
    db.clear();
    collection = db.getCollection('bar');
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
});
