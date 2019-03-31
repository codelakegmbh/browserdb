import {BrowserDb} from './browser-db';

export class BrowserDbManager {
  private readonly instances: BrowserDb[] = [];
  private static singletonInstance: BrowserDbManager;

  public getDatabase(name: string) {
    const existingInstance = this.instances.filter(x => x.getName() === name)[0];
    if (existingInstance) {
      return existingInstance;
    }
    const newInstance = new BrowserDb(name);
    this.instances.push(newInstance);
    return newInstance;
  }

  public static getInstance() {
    if (!BrowserDbManager.singletonInstance) {
      BrowserDbManager.singletonInstance = new BrowserDbManager();
    }
    return BrowserDbManager.singletonInstance;
  }
}

