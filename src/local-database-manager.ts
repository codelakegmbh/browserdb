import {LocalDatabase} from './local-database';

export class LocalDatabaseManager {
  private static readonly instances: LocalDatabase[] = [];

  static getDatabase(name: string) {
    const existingInstance = LocalDatabaseManager.instances.filter(x => x.getName() === name)[0];
    if (existingInstance) {
      return existingInstance;
    }
    const newInstance = new LocalDatabase(name);
    LocalDatabaseManager.instances.push(newInstance);
    return newInstance;
  }
}

