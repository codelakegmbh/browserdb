import { BrowserDb, BrowserDbManager, BrowserDbProp } from '../src';

describe('browser-db-prop-test', () => {
  class Foo {
    @BrowserDbProp('foo')
    public db: BrowserDb;
  }

  test('fills the given class property with a BrowserDb instance', () => {
    const g = new Foo();
    expect(g.db).toBeInstanceOf(BrowserDb);
  });

  test('the db instance has the proper name attached to it', () => {
    const g = new Foo();
    expect(g.db.getName()).toBe('foo');
  });

  test('assigns a database via the manager singleton', () => {
    const db = BrowserDbManager.getInstance().getDatabase('foo');

    const g = new Foo();
    expect(g.db).toBe(db);
  });
});
