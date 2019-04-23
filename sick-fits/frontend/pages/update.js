import React from 'react';
import PropTypes from 'prop-types';
import UpdateItem from '../components/UpdateItem';

const Update = ({ query }) => (
  <div>
    <UpdateItem id={query.id} />
  </div>
);

Update.propTypes = {
  query: PropTypes.shape({
    id: PropTypes.string.isRequired,
  }).isRequired,
};

export default Update;
