import { shallow } from 'enzyme';
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
  // Note: This isn't necessarily the best approach to testing this component
  // Snapshots might be better
  it('renders the image properly', () => {
    const wrapper = shallow(<ItemComponent item={fakeItem} />);
    const img = wrapper.find('img');
    expect(img.props().src).toBe(fakeItem.image);
    expect(img.props().alt).toBe(fakeItem.title);
  });
  it('renders the price tag and title properly', () => {
    const wrapper = shallow(<ItemComponent item={fakeItem} />);
    const PriceTag = wrapper.find('PriceTag');
    expect(PriceTag.children().text()).toBe('€50');
    expect(wrapper.find('Title a').text()).toBe(fakeItem.title);
  });
  it('renders the buttons properly', () => {
    const wrapper = shallow(<ItemComponent item={fakeItem} />);
    const buttonList = wrapper.find('.buttonList');
    expect(buttonList.children()).toHaveLength(3);
    expect(buttonList.find('Link')).toHaveLength(1);
    expect(buttonList.find('AddToCart')).toHaveLength(1);
    expect(buttonList.find('DeleteItem')).toHaveLength(1);
  });
});
