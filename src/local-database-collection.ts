import { LocalDatabase } from ".";

export class LocalDatabaseCollection {
  private items: any[] = [];

  constructor(
    private database: LocalDatabase,
    private name: string,
  ) {
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

  public insertItem(item: any) {
    this.items.push(item);
    window.localStorage.setItem(this.collectionKey(), JSON.stringify(this.items));
  }

  public selectItems<T = any>(predicate: (a: T) => boolean): T[] {
    return this.items.filter(predicate);
  }
}