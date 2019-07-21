import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import formatMoney from '../lib/formatMoney';

const CartItemStyles = styled.li`
  padding: 1rem 0;
  border-bottom: 1px solid ${props => props.theme.lightgrey};
  display: grid;
  align-items: center;
  grid-template-columns: auto 1fr auto;
  img {
    margin-right: 10px;
  }
  h3,
  p {
    margin: 0;
  }
`;

const CartItem = ({ cartItem }) => (
  <CartItemStyles>
    <img src={cartItem.item.image} alt={cartItem.item.title} width={100} />
    <div className="cart-item-details">
      <h3>{cartItem.item.title}</h3>
      <p>
        {formatMoney(cartItem.item.price * cartItem.quantity)}
        <em>{`${cartItem.quantity} × ${formatMoney(cartItem.item.price)}`}</em>
      </p>
    </div>
  </CartItemStyles>
);

CartItem.propTypes = {
  cartItem: PropTypes.shape({
    id: PropTypes.string.isRequired,
    quantity: PropTypes.number.isRequired,
  }),
};

export default CartItem;
