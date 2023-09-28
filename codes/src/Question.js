// Question.jsx
import React from 'react';
import { ComboChoiceQuestion, ButtonQuestion, DateQuestion, DateQuestion2, MultipleChoiceQuestion, StringQuestion, NumberQuestion } from './QuestionTypes';

export function Question({ questionData, onChange, isDisabled }) {
 
  switch (questionData.answerType.type) {
    case 'combo_choice':
      return <ComboChoiceQuestion {...questionData} onChange={onChange} isDisabled={isDisabled} />;
    case 'button':
      return <ButtonQuestion {...questionData} onChange={onChange} isDisabled={isDisabled} />;
    case 'date_MM_YYYY':
      return <DateQuestion {...questionData} onChange={onChange} isDisabled={isDisabled} />;
    case 'multiple_choice':
      return <MultipleChoiceQuestion {...questionData} onChange={onChange} isDisabled={isDisabled} />;
    case 'string':
      return <StringQuestion {...questionData} onChange={onChange} isDisabled={isDisabled} />;
    case 'number':
      return <NumberQuestion {...questionData} onChange={onChange} isDisabled={isDisabled} />;
    case 'date_MM_DD_YYYY':
      return <DateQuestion2 {...questionData} onChange={onChange} isDisabled={isDisabled} />;  
    default:
      return null;
  }
}