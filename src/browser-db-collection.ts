import { BrowserDb } from ".";

export class BrowserDbCollection {
  private __items: any[];
  private __readonlyItems: ReadonlyArray<any>;
  private __listeners: {
    insert: ((item: any, col: BrowserDbCollection) => void)[],
    [key: string]: Function[]
  } = {
    insert: []
  };

  constructor(
    private __database: BrowserDb,
    private __name: string,
  ) {
    const initialData = window.localStorage.getItem(this.collectionKey());
    if (initialData) {
      this.__items = JSON.parse(initialData);
    } else {
      this.__items = [];
    }
    this.__readonlyItems = Object.freeze(this.__items.slice());
  }

  public getName() {
    return this.__name;
  }

  public getDatabase() {
    return this.__database;
  }

  public collectionKey() {
    return `local-database[${this.__database.getName()}][${this.__name}]`;
  }

  private __persistCachedItems() {
    this.__readonlyItems = Object.freeze(this.__items.slice());
    window.localStorage.setItem(this.collectionKey(), JSON.stringify(this.__items));
  }

  public insertItem(item: any) {
    this.__items.push(item);
    this.__notifyListeners('insert', item, this);
    this.__persistCachedItems();
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

    this.__persistCachedItems();
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

    this.__persistCachedItems();

    return deletedItems;
  }

  public clear() {
    this.__items = [];
    this.__persistCachedItems();
  }

  private __notifyListeners(event: 'insert', item: any, collection: BrowserDbCollection): void;
  private __notifyListeners(event: string, ...params: any[]) {
    for (const listener of this.__listeners[event]) {
      listener(...params);
    }
  }

  public on<T = any>(event: 'insert', cb: (item: T, col: BrowserDbCollection) => void): void;
  public on<T = any>(event: 'update', cb: (items: T[], col: BrowserDbCollection) => void): void;
  public on(event: string, cb: Function) {
    if (this.__listeners[event] === undefined) {
      return;
    }
    this.__listeners[event].push(cb);
  }

  public getAllItems() {
    return this.__readonlyItems;
  }
}
