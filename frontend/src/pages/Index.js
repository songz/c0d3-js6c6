import React from 'react';
import { Link } from 'react-router-dom';

const Index = () => {
  return (
    <ul>
      <li>
        <Link to="/stars">Stars</Link>
      </li>
      <li>
        <Link to="/kanban">Kanban</Link>
      </li>
      <li>
        <Link to="/addLesson">Add Lesson</Link>
      </li>
    </ul>
  );
};

export default Index;
