# browserdb
browserdb is a wrapper around localStorage to enable document like local storing of objects in the browser.
It makes persisting and loading persisted objects inside web apps very easy and convenient.

It should mainly be used in PWAs to store state.
It should __NOT__ be used to store large amounts of data as it will not scale efficiently in regard to memory and speed!
So be careful how you use it or how a user of your application could use it and possibly dump it with too much data.

## Content

* [Installation](#installation)
* [Usage](#usage)
  * [Retrieving a database](#retrieving-a-database)
  * [Retrieving a collection](#retrieving-a-collection)
  * [Inserting data](#inserting-data)
  * [Selecting data](#selecting-data)
  * [Deleting data](#deleting-data)
  * [Updating data](#updating-data)
  * [Clearing a collection](#clearing-a-collection)
* [Some Q&A](#some-qa)

## Installation
browserdb can be installed via `npm i @codelake/browserdb`

## Usage
browserdb aims work very much document like as a system like MongoDB does.
So, the first thing you need before you can work on any data is a database.
In this case you need an instance of `BrowserDb`.

### Retrieving a database
You can just create it manually, or use the `BrowserDbManager` in order to reduce memory usage and keep data in your app in sync.
```typescript
import { BrowserDb, BrowserDbManager } from '@codelake/browserdb';

const db = new BrowserDb('foo');

// or via the BrowserDbManager singleton

const db = BrowserDbManager.getInstance().getDatabase('foo');
```
In either case you get a valid `BrowserDb` instance.
The only difference is, the instance from the `BrowserDbManager`'s `getDatabase(name)`
method will be kept in memory, so the exact instance can be shared across multiple spots in your code.

It is recommended to use the `BrowserDbManager` as the corresponding data from the actual `localStorage` is only read __ONCE__ at instantiation time and not synced afterwards!

### Retrieving a collection
The database on its own does not do anything yet.
In order to read or write data you have to get a `BrowserDbCollection`.
You can easily do so by calling the `getCollection(name)` method with the name of the desired collection.
```typescript
const collection = db.getCollection('bar');
```
If the collection was never accessed before, it will be instantiated for you.
During the instantiation the collection will read the data contained in the `localStorage` field where the key is the returned value of the collection's `collectionName()` method.

After the first instantiation, the data inside `localStorage` won't be read again but only written to!

### Inserting data
You can insert any data you want into a collection like to following code shows:
```typescript
collection.insertItem(4);
collection.insertItem('foo');
collection.insertItem({some: 'object'});
```

### Selecting data
To select data from a collection you have to provide a predicate, so the collection can determine what data should be returned.
```typescript
collection.insertItem({ id: 1, name: 'foo' });
collection.insertItem({ id: 2, name: 'bar' });

const matches = collection.selectItems(x => x.id === 1);
const foo = matches[0];
console.log(foo.name); // will print foo
```
The `selectItems(predicate)` method will always return an array of items which match the predicate.

### Deleting data
Deleting data required a predicate just as the selection of data does.
```typescript
collection.insertItem({ id: 1, name: 'foo' });
collection.insertItem({ id: 2, name: 'bar' });

const deletions = collection.deleteItems(x => x.id === 1);
```
The `deleteItems(predicate)` method returns an array which contains all the items which have been removed from the collection.

### Updating data
To update the data inside a collection you have to provide two callbacks: a `predicate` and an `updater`.
```typescript
collection.insertItem({ id: 1, name: 'Hello' });
collection.insertItem({ id: 2, name: 'Word' });

const updated = collection.updateItems(x => x.id === 2, x => {
  x.name = 'World';
  return x;
});
```
As the code shows, the `updater` has to return the new/updated item.
If you only modify the item (in case of a reference type), the `updateItems(predicate, updater)` method will still only use the return value of the updater.
So if you do not provide a return value, the new/updated item is going to be `undefined`!

### Clearing a collection
In case you want to delete all the data contained in a collection you have two options:
```typescript
collection.clear();
// or
collection.deleteItems(() => true);
```
If your only goal is to clear the collection, the `clear()` method is recommended, as it uses less storage.
But if you want to perform operations on the deleted items, you should use the second method, since it returns all the deleted items.

## Some Q&A

* When does the data of a collection get persisted?
  * Every time you modify the collection via its CRUD methods (except for reading/selecting data) the collection will automatically be persisted as soon as the operation of the collection has finished
* What happens if I modify a selected item without using the `updateItems` method?
  * Nothing - more or less
    
    If you modify items (in the sense of objects) outside the regular updating mechanism it will be updated in the internal data storage/cache of the collection, but the change will not be persisted.
    So, if you want to make sure all your changed are persisted, use the regular updating mechanism.
