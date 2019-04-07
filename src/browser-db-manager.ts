import {BrowserDb} from './browser-db';

export class BrowserDbManager {
  private readonly __instances: BrowserDb[] = [];
  private static __singletonInstance: BrowserDbManager;

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
    if (!BrowserDbManager.__singletonInstance) {
      BrowserDbManager.__singletonInstance = new BrowserDbManager();
    }
    return BrowserDbManager.__singletonInstance;
  }

  public clear() {
    while (this.__instances.length) {
      this.__instances[0].clear();
      this.__instances.splice(0, 1);
    }
  }
}
