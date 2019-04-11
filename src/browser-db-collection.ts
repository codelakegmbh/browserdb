import { BrowserDb } from ".";

export class BrowserDbCollection {
  private __items: any[];
  private __listeners: {
    insert: ((item: any, col: BrowserDbCollection) => void)[],
    [key: string]: Function[]
  } = {
    insert: []
  };

  constructor(
    private database: BrowserDb,
    private name: string,
  ) {
    const initialData = window.localStorage.getItem(this.collectionKey());
    if (initialData) {
      this.__items = JSON.parse(initialData);
    } else {
      this.__items = [];
    }
  }

  public getName() {
    return this.name;
  }

  public getDatabase() {
    return this.database;
  }

  public collectionKey() {
    return `local-database[${this.database.getName()}][${this.name}]`;
  }

  private persistCachedItems() {
    window.localStorage.setItem(this.collectionKey(), JSON.stringify(this.__items));
  }

  public insertItem(item: any) {
    this.__items.push(item);
    this.__notifyListeners('insert', item, this);
    this.persistCachedItems();
  }

  public selectItems<T = any>(predicate: (a: T) => boolean): T[] {
    return this.__items.filter(predicate);
  }

  public updateItems<T = any>(predicate: (item: T) => boolean, updater: (item: T) => void): T[] {
    const updatedItems: T[] = [];
    for (let i = 0; i < this.__items.length; ++i) {
      if (!predicate(this.__items[i])) {
        continue;
      }
      const result = updater(this.__items[i]);
      if (result !== undefined) {
        this.__items[i] = result;
      }
      updatedItems.push(this.__items[i]);
    }

    this.persistCachedItems();
    return updatedItems;
  }

  public deleteItems<T = any>(predicate: (a: T) => boolean): T[] {
    const deletedItems: T[] = [];

    for (let i = 0; i < this.__items.length; ++i) {
      if (!predicate(this.__items[i])) {
        continue;
      }
      deletedItems.push(this.__items[i]);
      this.__items.splice(i, 1);
    }

    this.persistCachedItems();

    return deletedItems;
  }

  public clear() {
    this.__items = [];
    this.persistCachedItems();
  }

  private __notifyListeners(event: 'insert', item: any, collection: BrowserDbCollection): void;
  private __notifyListeners(event: string, ...params: any[]) {
    for (const listener of this.__listeners[event]) {
      listener(...params);
    }
  }

  public on(event: 'insert', cb: <T = any>(item: T, col: BrowserDbCollection) => void): void;
  public on(event: string, cb: Function) {
    this.__listeners[event].push(cb);
  }
}
