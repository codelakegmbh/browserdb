import {LocalDatabase} from './local-database';

export class LocalDatabaseManager {
  private readonly instances: LocalDatabase[] = [];
  private static singletonInstance: LocalDatabaseManager;

  public getDatabase(name: string) {
    const existingInstance = this.instances.filter(x => x.getName() === name)[0];
    if (existingInstance) {
      return existingInstance;
    }
    const newInstance = new LocalDatabase(name);
    this.instances.push(newInstance);
    return newInstance;
  }

  public static getInstance() {
    if (!LocalDatabaseManager.singletonInstance) {
      LocalDatabaseManager.singletonInstance = new LocalDatabaseManager();
    }
    return LocalDatabaseManager.singletonInstance;
  }
}

