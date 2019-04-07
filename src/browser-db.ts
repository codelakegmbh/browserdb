import { BrowserDbCollection } from ".";

export class BrowserDb {
  private __collections: BrowserDbCollection[] = [];

  constructor(private __name: string) {
  }

  public getName() {
    return this.__name;
  }

  public getCollection(name: string) {
    const existingInstance = this.__collections.filter(x => x.getName() === name)[0];
    if (existingInstance) {
      return existingInstance;
    }
    const newInstance = new BrowserDbCollection(this, name);
    this.__collections.push(newInstance);
    return newInstance;
  }

  public clear() {
    while (this.__collections.length) {
      this.__collections[0].clear();
      this.__collections.splice(0, 1);
    }
  }
}
