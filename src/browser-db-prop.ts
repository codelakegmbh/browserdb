import {BrowserDbManager} from '../src';

export function BrowserDbProp(databaseName: string) {
  return function(target: any, propertyName: string) {
    target[propertyName] = BrowserDbManager.getInstance().getDatabase(databaseName);
  }
}
