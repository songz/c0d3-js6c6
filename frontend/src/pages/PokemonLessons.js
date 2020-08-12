import React, { useState, useEffect } from 'react';
import useQuery from '../utils/useQuery';
import PokemonSelection from '../components/PokemonSelection';
import Stars from '../components/Stars';

const PokemonLessons = ({ name, image }) => {
  const [update, setUpdate] = useState(0);
  const [{ result }, runQuery] = useQuery();

  useEffect(() => {
    (async function () {
      runQuery(`{
        user {lessons {title, rating}},
        lessons {title}
      }`);
    })();
  }, [update]);

  const enrollLesson = (lesson) => {
    runQuery(`mutation {enroll(title: "${lesson}") {name}}`);
    setUpdate(!update);
  };

  const unenrollLesson = (lesson) => {
    runQuery(`mutation {unenroll(title: "${lesson}") {name}}`);
    setUpdate(!update);
  };

  const rateLesson = (lesson, rating) => {
    runQuery(`mutation {rate(title: "${lesson}", rating: ${rating}) {name}}`);
    setUpdate(!update);
  };

  const enrolled =
    (result.user &&
      result.user.lessons.reduce((acc, lesson) => {
        acc[lesson.title] = lesson.rating;
        return acc;
      }, {})) ||
    {};

  const unenrolled =
    (result.lessons &&
      result.lessons.reduce((acc, lesson) => {
        if (!enrolled.hasOwnProperty(lesson.title)) acc[lesson.title] = true;
        return acc;
      }, {})) ||
    {};

  return (
    <div>
      <PokemonSelection name={name} image={image} />
      <div className="enrolled">
        <hr />
        <h2>Enrolled</h2>
        <p>Click on a star to rate a lesson, or click on the lesson name to unenroll</p>
        {Object.keys(enrolled).map((lesson) => {
          return (
            <div key={lesson} style={{ marginTop: '1rem' }}>
              <h4 onClick={() => unenrollLesson(lesson)}>{lesson}</h4>
              <Stars
                initialRating={enrolled[lesson]}
                onClick={(rating) => rateLesson(lesson, rating)}
              />
            </div>
          );
        })}
      </div>
      <div className="unenrolled">
        <hr />
        <h2>Not Enrolled</h2>
        <p>Click on the lesson name to enroll</p>
        {Object.keys(unenrolled).map((lesson) => {
          return (
            <div key={lesson} style={{ marginTop: '1rem' }}>
              <h4 onClick={() => enrollLesson(lesson)}>{lesson}</h4>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PokemonLessons;
