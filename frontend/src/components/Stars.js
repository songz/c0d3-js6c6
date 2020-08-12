import React from 'react';

import '../styles/stars.css';

const ratings = [1, 2, 3, 4, 5];

const Star = ({ selected, onClick, onMouseEnter }) => {
  return (
    <i
      className={selected ? 'fas fa-star' : 'far fa-star'}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
    ></i>
  );
};

const Stars = ({onClick, initialRating }) => {
  const [rating, setRating] = React.useState(initialRating);
  const [isClicked, setClicked] = React.useState(false);

  const handleClick = (i) => {
    setClicked(true);
    onClick(i);
    setRating(i);
  };

  const handleMouseEnter = (i) => {
    if (!isClicked) setRating(i);
  };

  return (
    <span className="stars-container" onMouseEnter={() => setClicked(false)}>
      {ratings.map((i) => (
        <Star
          key={i}
          selected={rating >= i}
          onClick={() => handleClick(i)}
          onMouseEnter={() => handleMouseEnter(i)}
        />
      ))}
    </span>
  );
};

export default Stars;
