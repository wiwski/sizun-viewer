import React from 'react';
import PropTypes from 'prop-types';

const DateTimeFormatter = ({ dateTime }) => {
  const formattedDate = new Intl.DateTimeFormat('fr-FR', {
    dateStyle: 'full',
    timeStyle: 'short',
  }).format(new Date(Date.parse(dateTime)));
  return <span>{formattedDate}</span>;
};

DateTimeFormatter.propTypes = {
  dateTime: PropTypes.string,
};

export default DateTimeFormatter;
