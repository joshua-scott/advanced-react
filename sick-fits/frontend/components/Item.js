import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import Title from './styles/Title';
import ItemStyles from './styles/ItemStyles';
import PriceTag from './styles/PriceTag';
import formatMoney from '../lib/formatMoney';

class Item extends Component {
  static propTypes = {
    item: PropTypes.object.isRequired,
  };

  render() {
    const {
      item: { id, title, description, image, largeImage, price },
    } = this.props;

    return (
      <ItemStyles>
        {image && <img src={image} alt={title} />}
        <Title>
          <Link href={{ pathname: '/item', query: { id } }}>
            <a>{title}</a>
          </Link>
        </Title>
        <PriceTag>{formatMoney(price)}</PriceTag>
        <p>{description}</p>

        <div className="buttonList">
          <Link href={{ pathname: '/update', query: { id } }}>
            <a>Edit ✏️</a>
          </Link>
          <button>Add to Cart</button>
          <button>Delete</button>
        </div>
      </ItemStyles>
    );
  }
}

export default Item;
