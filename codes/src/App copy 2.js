import React, { useState, useRef } from 'react';
import parentQuestions from './parentQuestions.json';
import dynamicQuestions from './dynamicQuestions.json'; 
import parentQuestions_selectedAnswers from './parentQuestions_selectedAnswers.json';
import { Questions } from './Questions';
import { Panels } from './Panels';
import { SanctionsExposure } from './SanctionsExposure';

function App() {
  const [answers, setAnswers] = useState({ tab1: {}, tab2: {} });
  const [commonAnswers, setCommonAnswers] = useState({});
  const [sanctionExposure, setSanctionExposure] = useState({ tab1: [], tab2: [] });
  const [panels, setPanels] = useState([]);
  const [currentTab, setCurrentTab] = useState('tab1');
  const createdSections = useRef([]); // static array to store created sections

  const allQuestions = parentQuestions.concat(dynamicQuestions);

  function handleAnswer(questionId, answer) {
    setAnswers(prevAnswers => {
      const updatedAnswers = { 
        ...prevAnswers, 
        [currentTab]: { ...prevAnswers[currentTab], [questionId]: answer } 
      };

      setCommonAnswers(prevCommonAnswers => {
        return {...prevCommonAnswers, [questionId]: answer};
      });

      // Update sanctionExposure immediately after updating answers
      const matchedItems = parentQuestions_selectedAnswers.filter(item =>
        Object.keys(item.selectedAnswers).every(key => item.selectedAnswers[key] === updatedAnswers[currentTab][key])
      );

      setSanctionExposure(prevSanctionExposure => ({
        ...prevSanctionExposure,
        [currentTab]: 
          matchedItems.map(item => ({
            sanctionExposureType: item.sanctionExposureType,
            sanctionExposureSubType1: item.sanctionExposureSubType1,
            sanctionExposureSubType2: item.sanctionExposureSubType2,
            sanctionExposureSubType3: item.sanctionExposureSubType3,
          }))
      }));

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

      <button onClick={() => setCurrentTab('tab1')}>Tab 1</button>
      <button onClick={() => setCurrentTab('tab2')}>Tab 2</button>

      <SanctionsExposure items={sanctionExposure[currentTab]} />

      <Questions
        questions={allQuestions}
        answers={commonAnswers}
        handleAnswer={handleAnswer}
        sanctionExposure={sanctionExposure[currentTab]}
      />
      <button onClick={() => {
        console.log('State at submit:', {
          answers: answers[currentTab],
          commonAnswers,
          sanctionExposure: sanctionExposure[currentTab],
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