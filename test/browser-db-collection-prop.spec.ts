import { BrowserDbCollectionProp, BrowserDbCollection, BrowserDbManager } from '../src';

describe('browser-db-collection-prop-tests', () => {
  class Foo {
    @BrowserDbCollectionProp('foo', 'bar')
    public collection: BrowserDbCollection;
  }

  test('fills the given class property with a BrowserDbCollection instance', () => {
    const g = new Foo();
    expect(g.collection).toBeInstanceOf(BrowserDbCollection);
  });

  test('the collection instance has the proper name attached to it', () => {
    const g = new Foo();
    expect(g.collection.getName()).toBe('bar');
  });

  test('the database of the collection instance has the proper name attached to it', () => {
    const g = new Foo();
    expect(g.collection.getDatabase().getName()).toBe('foo');
  });

  test('assigns a database via the manager singleton', () => {
    const collection = BrowserDbManager.getInstance().getDatabase('foo').getCollection('bar');

    const g = new Foo();
    expect(g.collection).toBe(collection);
  });
});
