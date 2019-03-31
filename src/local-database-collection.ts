import { LocalDatabase } from ".";

export class LocalDatabaseCollection {
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
}