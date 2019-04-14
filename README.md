# browserdb
browserdb is a wrapper around localStorage to enable document like local storing of objects in the browser.
It makes persisting and loading persisted objects inside web apps very easy and convenient.

It should mainly be used in PWAs to store state.
It should __NOT__ be used to store large amounts of data as it will not scale efficiently in regard to memory and speed!
So be careful how you use it or how a user of your application could use it and possibly dump it with too much data.

__Note:__ The master branch will contain work that is still work-in-progress.
So if you want to download a stable version of the library source code please get it from the GitHub release page.

## Content

* [Installation](#installation)
* [Retrieving a database](#retrieving-a-database)
* [Retrieving a collection](#retrieving-a-collection)
* [Meta Programming](#meta-programming)
* [Collection Usage](#collection-usage)
  * [Inserting data](#inserting-data)
  * [Selecting data](#selecting-data)
  * [Deleting data](#deleting-data)
  * [Updating data](#updating-data)
  * [Clearing a collection](#clearing-a-collection)
* [Events](#events)
  * [insert event](#insert-event)
  * [update event](#update-event)
  * [delete event](#delete-event)
  * [clear event](#clear-event)
* [Some Q&A](#some-qa)

## Installation
browserdb can be installed via `npm i @codelake/browserdb`

## Retrieving a database
You can just create it manually, or use the `BrowserDbManager` in order to reduce memory usage and keep data in your app in sync.
```typescript
import { BrowserDb, BrowserDbManager } from '@codelake/browserdb';
// or via require and object destructuring
const { BrowserDb, BrowserDbManager } = require('@codelake/browserdb');
// or one by one via require
const BrowserDb = require('@codelake/browserdb').BrowserDb;
const BrowserDbManager = require('@codelake/browserdb').BrowserDbManager;

const db = new BrowserDb('foo');

// or via the BrowserDbManager singleton

const db = BrowserDbManager.getInstance().getDatabase('foo');
```
In either case you get a valid `BrowserDb` instance.
The only difference is, the instance from the `BrowserDbManager`'s `getDatabase(name)`
method will be kept in memory, so the exact instance can be shared across multiple spots in your code.

It is recommended to use the `BrowserDbManager` as the corresponding data from the actual `localStorage` is only read __ONCE__ at instantiation time and not synced afterwards!

## Retrieving a collection
The database on its own does not do anything yet.
In order to read or write data you have to get a `BrowserDbCollection`.
You can easily do so by calling the `getCollection(name)` method with the name of the desired collection.
```typescript
const collection = db.getCollection('bar');
```
If the collection was never accessed before, it will be instantiated for you.
During the instantiation the collection will read the data contained in the `localStorage` field where the key is the returned value of the collection's `collectionName()` method.

After the first instantiation, the data inside `localStorage` won't be read again but only written to!

## Meta Programming
By now you've seen some ways to retrieve a `BrowserDbCollection` so you can persist your data.
But it is pretty annoying to always fetch the fitting collection via the `BrowserDbManager` Singleton.
So, if you are building your application with classes in TypeScript (or with babel and the decorators plugin)
you can also use decorators to retrieve `BrowserDb` and `BrowserDbCollection` instances!

To attach a `BrowserDb` instance to a class field just use the `BrowserDbProp` decorator:
```typescript
import {BrowserDb, BrowserDbProp} from '@codelake/browserdb';

class SomeComponent {
  @BrowserDbProp('foo')
  private db: BrowserDb;
}
```
In the above example, the decorator will insert a `BrowserDb` instance
into the `db` property of a newly created `SomeComponent` instance.
That instance is internally fetched via the `BrowserDbManager`.

But in your case you may need the whole database but only one of its collections.
The steps necessary to do so are very similar to the ones to bind a database:
```typescript
import {BrowserDbCollection, BrowserDbCollectionProp} from '@codelake/browserdb';

class SomeComponent {
  @BrowserDbCollectionProp('foo', 'bar')
  private collection: BrowserDbCollection;
}
```
In this example the first parameter of `BrowserDbCollectionProp` corresponds
to the database name and the second parameter corresponds to the collection name.

## Collection Usage
browserdb aims work very much document like as a system like MongoDB does.
So, the first thing you need before you can work on any data is a database.
In this case you need an instance of `BrowserDb`.

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

If the updater returns `undefined` the updating mechanism will keep the original object with its updated property/properties.
So you can shorten the update call to
```typescript
collection.updateItems(x => x.id === 2, x => { x.name = 'World'; });
```
But remember to keep the curly braces around the assignment.
If you omit them, the returned value of the assignment (in the example the string `'World'`) will become the new/updated item!

### Clearing a collection
In case you want to delete all the data contained in a collection you have two options:
```typescript
collection.clear();
// or
collection.deleteItems(() => true);
```
If your only goal is to clear the collection, the `clear()` method is recommended, as it uses less memory.
But if you want to perform operations on the deleted items, you should use the second method, since it returns all the deleted items.

__Note:__ Be careful which way of collection clearing you use if your application makes use of events
as the `clear` and `deleteItems` methods trigger different events!
See [delete event](#delete-event).

## Events
It might also be the case that you are interested in the changes that happen to the data of a `BrowserDbCollection`.
Hooking into such events is fairly easy.
To do so, you just have to add a listener (callback) to the event you are interested in.

### insert event
This event is triggered after an item has been inserted into the collection.
The callback will receive the inserted item and the collection in which the item has been inserted.

```typescript
collection.on('insert', (item: any, col: BrowserDbCollection) => {
  // do stuff
});
```

### update event
This event is triggered after items in the collection have been updated.
The callback will receive the array of updated items and the collection in which the items have been updated.

__Note:__ This event is only triggered if an update took place -
so, if an item in the collection matched the predicate.

```typescript
collection.on('update', (items: any[], col: BrowserDbCollection) => {
  // do stuff
});
```

### delete event
This event is triggered after items in the collection have been deleted.
The callback will receive the array of deleted items and the collection from which the items have been deleted.

__Note:__ This event is only triggered if a deletion took place -
so, if an item in the collection matched the predicate.

```typescript
collection.on('delete', (items: any[], col: BrowserDbCollection) => {
  // do stuff
});
```

### clear event
This event is triggered after The collection has been cleared.
The callback will receive the collection which has been cleared.

__Note:__ This event will only be triggered if the `clear` method has been called.
If you delete all the items of a collection via a call of the `deleteItems` method
with a predicate which matches all items, it will trigger the `delete` event instead
of the `clear` event.

```typescript
collection.on('clear', (col: BrowserDbCollection) => {
  // do stuff
});
```

## Some Q&A

* When does the data of a collection get persisted?
  * Every time you modify the collection via its CRUD methods (except for reading/selecting data) the collection will automatically be persisted as soon as the operation of the collection has finished
* What happens if I modify a selected item without using the `updateItems` method?
  * Nothing - more or less

    If you modify items (in the sense of objects) outside the regular updating mechanism it will be updated in the internal data storage/cache of the collection, but the change will not be persisted.
    So, if you want to make sure all your changed are persisted, use the regular updating mechanism.
