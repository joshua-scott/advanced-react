function Person(name, foods) {
  this.name = name;
  this.foods = foods;
}

Person.prototype.fetchFavFoods = function() {
  return new Promise((resolve, reject) => {
    // Simulate an API that responsed in 2 seconds
    setTimeout(() => {
      resolve(this.foods);
    }, 2000);
  });
};

describe('learning mocking', () => {
  it('mocks a regular function', () => {
    const fetchDogs = jest.fn();
    fetchDogs('dave');
    expect(fetchDogs).toHaveBeenCalledWith('dave');
  });

  it('can create a person', () => {
    const me = new Person('Josh', ['pizza', 'burgers']);
    expect(me.name).toBe('Josh');
  });

  it('can fetch foods', async () => {
    const me = new Person('Josh', ['sushi', 'burgers']);

    // We could do this immediately and request from the real api:
    // const favFoods = await me.fetchFavFoods();

    // ...but that has some problems:
    // 1. It slows down our tests
    // 2. It means we're not testing *only* our code
    // 3. Our tests will break if the api is down for whatever reason

    // To avoid these issues, we can just mock the API function instead
    // and assume it'll return whatever we need it to.
    // That way, we're testing our code and don't have to rely on it.
    me.fetchFavFoods = jest.fn().mockResolvedValue(['sushi', 'burgers']);

    // After that, we just run our code as usual to test it:
    const favFoods = await me.fetchFavFoods();

    expect(favFoods).toBeDefined();
    expect(favFoods).toContain('sushi');
  });
});
