import { BrowserDbCollection } from ".";

export class BrowserDb {
  private collections: BrowserDbCollection[] = [];

  constructor(private name: string) {
  }

  public getName() {
    return this.name;
  }

  public getCollection(name: string) {
    const existingInstance = this.collections.filter(x => x.getName() === name)[0];
    if (existingInstance) {
      return existingInstance;
    }
    const newInstance = new BrowserDbCollection(this, name);
    this.collections.push(newInstance);
    return newInstance;
  }
}
