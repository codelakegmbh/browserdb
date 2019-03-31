import { BrowserDb } from ".";

export class BrowserDbCollection {
  private items: any[];

  constructor(
    private database: BrowserDb,
    private name: string,
  ) {
    const initialData = window.localStorage.getItem(this.collectionKey());
    if (initialData) {
      this.items = JSON.parse(initialData);
    } else {
      this.items = [];
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
    window.localStorage.setItem(this.collectionKey(), JSON.stringify(this.items));
  }

  public insertItem(item: any) {
    this.items.push(item);
    this.persistCachedItems();
  }

  public selectItems<T = any>(predicate: (a: T) => boolean): T[] {
    return this.items.filter(predicate);
  }

  public updateItems<T = any>(predicate: (item: T) => boolean, updater: (item: T) => void): T[] {
    const updatedItems: T[] = [];
    for (let i = 0; i < this.items.length; ++i) {
      if (!predicate(this.items[i])) {
        continue;
      }
      const result = updater(this.items[i]);
      if (result !== undefined) {
        this.items[i] = result;
      }
      updatedItems.push(this.items[i]);
    }

    this.persistCachedItems();
    return updatedItems;
  }

  public deleteItems<T = any>(predicate: (a: T) => boolean): T[] {
    const deletedItems: T[] = [];

    for (let i = 0; i < this.items.length; ++i) {
      if (!predicate(this.items[i])) {
        continue;
      }
      deletedItems.push(this.items[i]);
      this.items.splice(i, 1);
    }

    this.persistCachedItems();

    return deletedItems;
  }

  public clear() {
    this.items = [];
    this.persistCachedItems();
  }
}
