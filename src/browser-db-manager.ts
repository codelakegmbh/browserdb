import {BrowserDb} from './browser-db';

export class BrowserDbManager {
  private readonly __instances: BrowserDb[] = [];
  private static singletonInstance: BrowserDbManager;

  public getDatabase(name: string) {
    const existingInstance = this.__instances.filter(x => x.getName() === name)[0];
    if (existingInstance) {
      return existingInstance;
    }
    const newInstance = new BrowserDb(name);
    this.__instances.push(newInstance);
    return newInstance;
  }

  public static getInstance() {
    if (!BrowserDbManager.singletonInstance) {
      BrowserDbManager.singletonInstance = new BrowserDbManager();
    }
    return BrowserDbManager.singletonInstance;
  }
}

