import React, { useState, useEffect } from 'react';
import sendQuery from '../utils/sendQuery';
import PokemonSelection from '../components/PokemonSelection';

const PokemonLessons = ({ name, image }) => {
  const [userLessons, setUserLessons] = useState({});
  const [lessons, setLessons] = useState({});
  const [update, setUpdate] = useState(0);

  const enrollLesson = (lesson) => {
    sendQuery(`mutation {enroll(title: "${lesson}") {name}}`).then((data) => {
      if (data.enroll.name) {
        setUpdate(!update);
      }
    });
  };

  const unenrollLesson = (lesson) => {
    sendQuery(`mutation {unenroll(title: "${lesson}") {name}}`).then((data) => {
      if (data.unenroll.name) {
        setUpdate(!update);
      }
    });
  };

  useEffect(() => {
    async function fetchData() {
      const queryResult = await sendQuery(`{
        user {lessons {title}},
        lessons {title}
      }`);

      const enrolled = queryResult.user.lessons.reduce((acc, lesson) => {
        acc[lesson.title] = true;
        return acc;
      }, {});

      const unenrolled = queryResult.lessons.reduce((acc, lesson) => {
        if (!enrolled[lesson.title]) acc[lesson.title] = true;
        return acc;
      }, {});

      setUserLessons(enrolled);
      setLessons(unenrolled);
    }
    fetchData();
  }, [update]);

  return (
    <div>
      <PokemonSelection name={name} image={image} />
      <div className="enrolled">
        <hr />
        <h2>Enrolled</h2>
        {Object.keys(userLessons).map((lesson) => {
          return <h4 key={lesson} onClick={() => unenrollLesson(lesson)}>{lesson}</h4>;
        })}
      </div>
      <div className="unenrolled">
        <hr />
        <h2>Not Enrolled</h2>
        <p>Click to enroll</p>
        {Object.keys(lessons).map((lesson) => {
          return <h4 key={lesson} onClick={() => enrollLesson(lesson)}>{lesson}</h4>;
        })}
      </div>
    </div>
  );
};

export default PokemonLessons;
