import React, { useState, useEffect, useRef } from 'react';
import parentQuestions from './parentQuestions.json';
import tab_dynamicQuestions from './tab_dynamicQuestions.json';
import parentQuestions_selectedAnswers from './parentQuestions_selectedAnswers.json';
import { Questions } from './Questions';
import { Panels } from './Panels';
import { SanctionsExposure } from './SanctionsExposure';
import './App.css'; // Import the CSS file

function App() {
  const [dynamicQuestions, setDynamicQuestions] = useState({ tab1: [], tab2: [] });
  const [answers, setAnswers] = useState({});
  const [sanctionExposure, setSanctionExposure] = useState([]);
  const [panels, setPanels] = useState([]);
  const createdSections = useRef([]); // static array to store created sections

  useEffect(() => {
    ['tab1', 'tab2'].forEach(tab => {
      import(`./${tab_dynamicQuestions[tab]}`)
        .then((questions) => {
          setDynamicQuestions(prevState => ({
            ...prevState,
            [tab]: questions.default,
          }));
        })
        .catch((error) => console.error(`Error loading dynamic questions for ${tab}:`, error));
    });
  }, []);

  function handleAnswer(questionId, answer) {
    setAnswers(prevAnswers => {
      const updatedAnswers = { 
        ...prevAnswers, 
        [questionId]: answer 
      };

      const matchedItems = parentQuestions_selectedAnswers.filter(item =>
        Object.keys(item.selectedAnswers).every(key => item.selectedAnswers[key] === updatedAnswers[key])
      );

      setSanctionExposure(
        matchedItems.map(item => ({
          sanctionExposureType: item.sanctionExposureType,
          sanctionExposureSubType1: item.sanctionExposureSubType1,
          sanctionExposureSubType2: item.sanctionExposureSubType2,
          sanctionExposureSubType3: item.sanctionExposureSubType3,
        }))
      );

      return updatedAnswers;
    });
  }

  function handleDeletePanel(index) {
    setPanels(prevPanels => prevPanels.filter((_, i) => i !== index));
    createdSections.current = createdSections.current.filter((_, i) => i !== index);
  }

  return (
    <div className="App">
      <h1>What is the Sanctions exposure?</h1>

      <SanctionsExposure items={sanctionExposure} />

      <div className="tabs">
        <div className="tab">
          <h2>Tab 1</h2>
          <Questions
            questions={parentQuestions.concat(dynamicQuestions['tab1'])}
            answers={answers}
            handleAnswer={handleAnswer}
            sanctionExposure={sanctionExposure}
          />
        </div>

        <div className="tab">
          <h2>Tab 2</h2>
          <Questions
            questions={dynamicQuestions['tab2']}
            answers={answers}
            handleAnswer={handleAnswer}
            sanctionExposure={sanctionExposure}
          />
        </div>
      </div>

      <button onClick={() => {
        console.log('State at submit:', {
          answers,
          sanctionExposure,
          panels,
        });
      }}>Submit</button>

      <Panels
        panels={panels}
        handleDeletePanel={handleDeletePanel}
      />
    </div>
  );
}

export default App;