import React, { useEffect, useState } from 'react';
import { Question } from './Question';

const findDependency = (condition, type) => {
  if (!condition) return true;
  return condition.hasOwnProperty(type);
};

const checkDependency = (answers, condition, sanctionExposure) => {
  let questionIds; // Declare questionIds here

  // Check questionId condition if it's specified
  if (findDependency(condition, 'questionId')) {
    questionIds = condition.questionId;
    // If questionIds is an array, all questions must be answered
    if (Array.isArray(questionIds)) {
      for (let questionId of questionIds) {
        if (!answers.hasOwnProperty(questionId)) {
          return [`Question with ID ${questionId} is not answered yet`];
        }      
      }
    } else if (!answers.hasOwnProperty(questionIds)) {
      return [`Question with ID ${questionIds} is not answered yet`];
    }
  }

  // If it's a single question id, check if it's answered
  else if (questionIds && !answers.hasOwnProperty(questionIds)) {
    return [`Question with ID ${questionIds} is not answered yet`];
  }

  // Only check for a specific value if one is defined in the condition
  if (questionIds && condition.value !== undefined && answers[questionIds] !== condition.value) {
    return [`Expected answer for question with ID ${questionIds} to be ${condition.value}, but got ${answers[questionIds]}`];
  }

  // Check answer condition if it's specified
  if (findDependency(condition, 'answer')) {
    // If the answer is not provided yet, return false
    if (!answers.hasOwnProperty(condition.questionId)) {
      return [`Question with ID ${condition.questionId} is not answered yet`];
    }
    // Only check for a specific answer if one is defined in the condition
    if (condition.answer !== undefined) {
      const conditionAnswer = typeof condition.answer === 'object' && condition.answer !== null && condition.answer.equals
          ? condition.answer.equals
          : condition.answer;
  
      if (JSON.stringify(answers[condition.questionId]) !== JSON.stringify(conditionAnswer)) {
          return [`Expected answer for question with ID ${condition.questionId} to be ${JSON.stringify(conditionAnswer)}, but got ${JSON.stringify(answers[condition.questionId])}`];
      }
    }
  }   

  // Check sanctionExposure conditions if they're specified
  const sanctionTypes = ['sanctionExposureType', 'sanctionExposureSubType1', 'sanctionExposureSubType2', 'sanctionExposureSubType3'];
  let sanctionCheckResults = [];
  
  for (const type of sanctionTypes) {
    console.log('sanctionExposure:', {sanctionExposure});
    if (findDependency(condition, type)) {
      // If the sanction exposure type is not provided yet, return a reason
      //console.log('louis debug1.1 - type:', type);
      //console.log('louis debug1.2 - !sanctionExposure:', !sanctionExposure);
      //console.log('louis debug1.3 - !sanctionExposure.hasOwnProperty(type):', !sanctionExposure.hasOwnProperty(type));

      if (!sanctionExposure || sanctionExposure.length === 0 || !sanctionExposure[0].hasOwnProperty(type)) {
        sanctionCheckResults.push(`Sanction Exposure of type ${type} is not provided yet`);
      }
      // If there's a condition for the sanction exposure type to be equal to something and it's not, return a reason
      else if (condition[type]?.hasOwnProperty('equals') && sanctionExposure[0]?.[type] !== condition[type]?.equals) {
        sanctionCheckResults.push(`Expected sanction exposure of type ${type} to be ${condition[type]?.equals}, but got ${sanctionExposure[0]?.[type]}`);
      }
      // If there's a condition for the sanction exposure type to not be equal to something and it is, return a reason
      else if (condition[type]?.hasOwnProperty('notEquals') && sanctionExposure[0]?.[type] === condition[type]?.notEquals) {
        sanctionCheckResults.push(`Expected sanction exposure of type ${type} not to be ${condition[type]?.notEquals}, but got ${sanctionExposure[0]?.[type]}`);
      }
      // If passed all checks, push null (no reason)
      else {
        sanctionCheckResults.push(null);
      }
    }
  }

  // Evaluate sanctionCheckResults based on AND or OR conditions
  if (condition.and && sanctionCheckResults.filter(reason => reason !== null).length > 0) {
    return sanctionCheckResults.filter(reason => reason !== null);
}


if (condition.or && !sanctionCheckResults.includes(null)) {
  return sanctionCheckResults.filter(reason => reason !== null);
}


  // By default, return null (no reason)
  return sanctionCheckResults.filter(reason => reason !== null).length > 0 ? sanctionCheckResults.filter(reason => reason !== null) : null;

};

function checkComplexDependency(questionIdToAnswerMap, dependentOn, sanctionExposure) {
  const reasons = [];

  const checkCondition = (condition) => {
    if (condition.and) {
      return condition.and.every(checkCondition);
    }
  
    if (condition.or) {
      const orResults = condition.or.map(checkCondition);
      const anyTrue = orResults.includes(true);
      // If none of the conditions are true, push all the reasons to our reasons array
      if (!anyTrue) {
        orResults.forEach((result, index) => {
          if (!result) {
            // Here we push an array of reasons for each "or" group
            reasons.push(`For condition ${index + 1} in "or" group: ${condition.or[index]}`);
          }
        });
      }
      return anyTrue;
    }
  
    const reason = checkDependency(questionIdToAnswerMap, condition, sanctionExposure);
    if (reason) {
      // We push the reason as an array to match the new structure
      reasons.push([reason]);
      return false;
    }
    return true;
  };

  if (!dependentOn || dependentOn.length === 0) {
    return [true, reasons];
  }

  if (Array.isArray(dependentOn)) {
    return [dependentOn.every(checkCondition), reasons];
  }

  if (dependentOn.questionId) {
    return [checkCondition(dependentOn), reasons];
  }

  if (dependentOn.and) {
    return [dependentOn.and.every(checkCondition), reasons];
  }

  if (dependentOn.or) {
    return [dependentOn.or.some(checkCondition), reasons];
  }

  return [true, reasons];
}

export function Questions({ questions, answers, handleAnswer, sanctionExposure}) {
  const [filteredQuestions, setFilteredQuestions] = useState([]); // Add this line
  const [filteredReasons, setFilteredReasons] = useState([]); 

  const [answersLog, setAnswersLog] = useState('');

  useEffect(() => {
    const newFilteredQuestions = [];
    const newFilteredReasons = {};
    for (const question of questions) {
      const [isComplexDependencyMet, reasons] = checkComplexDependency(answers, question.dependentOn, sanctionExposure);
      if (isComplexDependencyMet) {
        newFilteredQuestions.push(question);
      }
      newFilteredReasons[question.questionId] = reasons;
    }
    setFilteredQuestions(newFilteredQuestions); 
    setFilteredReasons(newFilteredReasons);
  }, [questions, answers, sanctionExposure]); // Include sanctionExposure as a dependency

  useEffect(() => {
    setAnswersLog(`sanctionExposure: ${JSON.stringify(answers)}`);
  }, [answers]);

  return (
    <div className="table-responsive">
      <table className="table table-bordered table-condensed table-striped">
        <thead>
          <tr>
            <th>Question ID</th>
            <th>Question</th>
            <th>Answer</th>
          </tr>
        </thead>
        <tbody>
          {filteredQuestions.map((questionData) => {
            // Check if the question meets its dependency conditions
            const [isDependencyMet] = checkComplexDependency(answers, questionData.dependentOn, sanctionExposure);

            // The question is disabled if it doesn't meet its dependency conditions
            const isDisabled = !isDependencyMet;

            // Set the disable reason
            const disableReason = isDisabled ? ["Dependency conditions not met"] : null;

            return (
              <tr key={questionData.questionId}>
                <td>{questionData.questionId}</td>
                <td>
                  <Question
                    questionData={questionData}
                    onChange={handleAnswer}
                    isDisabled={isDisabled && !questionData.isRequired} 
                  />
                  {disableReason && 
                    <div>
                      <strong>Disabled Reason:</strong> 
                      <ul>
                        {disableReason.map((reason, index) => <li key={index}>{reason}</li>)}
                      </ul>
                    </div>
                  }
                </td>
                <td>{answers[questionData.questionId] || 'No answer yet'}</td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <div>
        <h2>Filtered Question Reasons (for debug):</h2>
        <ul>
          {Object.entries(filteredReasons).map(([questionId, orGroupReasons]) => (
            <li key={questionId}>
              <strong>{questionId}:</strong>
              {console.log('orGroupReasons:', orGroupReasons)} {/* Log the value of orGroupReasons */}
              {(Array.isArray(orGroupReasons) ? orGroupReasons : [orGroupReasons]).map((reasons, index) => {
                console.log('reasons:', reasons); // Log the value of reasons
                return (
                  <div key={index}>
                    <h6>OR group {index + 1}:</h6>
                    <ul>
                      {(Array.isArray(reasons) ? reasons : [reasons]).map((reason, rIndex) => <li key={rIndex}>{reason}</li>)}
                    </ul>
                  </div>
                );
              })}
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h2>Answers log:</h2>
        <pre>{answersLog}</pre>
      </div>

    </div>
  );
}
