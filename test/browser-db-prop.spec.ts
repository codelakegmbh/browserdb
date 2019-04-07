import { BrowserDb, BrowserDbManager, BrowserDbProp } from '../src';

describe('browser-db-prop-test', () => {
  test('fills the given class property with a BrowserDb instance', () => {
    class Foo {
      @BrowserDbProp('foo')
      public db: BrowserDb;
    }

    const g = new Foo();
    expect(g.db).toBeInstanceOf(BrowserDb);
  });

  test('the db instance has the proper name attached to it', () => {
    class Foo {
      @BrowserDbProp('foo')
      public db: BrowserDb;
    }

    const g = new Foo();
    expect(g.db.getName()).toBe('foo');
  });

  test('assigns a database via the manager singleton', () => {
    BrowserDbManager.getInstance().clear();
    const db = BrowserDbManager.getInstance().getDatabase('foo');
    class Foo {
      @BrowserDbProp('foo')
      public db: BrowserDb;
    }

    const g = new Foo();
    expect(g.db).toBe(db);
  });
});
