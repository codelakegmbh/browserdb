let storage: { [key: string]: string } = {};

spyOn(window.localStorage, 'setItem').and.callFake((key: string, value: string) => {
  storage[key] = value;
});

spyOn(window.localStorage, 'getItem').and.callFake((key: string) => {
  return storage[key];
});
