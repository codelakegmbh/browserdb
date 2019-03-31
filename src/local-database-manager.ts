import {LocalDatabase} from './local-database';

export class LocalDatabaseManager {
  private readonly instances: LocalDatabase[] = [];

  public getDatabase(name: string) {
    const existingInstance = this.instances.filter(x => x.getName() === name)[0];
    if (existingInstance) {
      return existingInstance;
    }
    const newInstance = new LocalDatabase(name);
    this.instances.push(newInstance);
    return newInstance;
  }
}

