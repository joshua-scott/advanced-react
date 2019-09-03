import React from 'react';
import { shallow } from 'enzyme';
import toJSON from 'enzyme-to-json';
import ItemComponent from '../components/Item';

const fakeItem = {
  id: 'ABC123',
  title: 'Cool item',
  price: 5000,
  description: 'A description',
  image: 'dog.jpg',
  largeImage: 'largeDog.jpg',
};

describe('<Item />', () => {
  it('renders and matches the snapshot', () => {
    const wrapper = shallow(<ItemComponent item={fakeItem} />);
    expect(toJSON(wrapper)).toMatchSnapshot();
  });
});
