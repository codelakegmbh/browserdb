import {BrowserDbManager} from '.';

export function BrowserDbCollectionProp(databaseName: string, collectionName: string) {
  return function(target: any, propertyName: string) {
    target[propertyName] = BrowserDbManager
      .getInstance()
      .getDatabase(databaseName)
      .getCollection(collectionName);
  };
}
