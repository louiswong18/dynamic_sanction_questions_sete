// QuestionTypes.jsx
import React from 'react';
import moment from 'moment';

export function ComboChoiceQuestion({ questionId, question, answerOptions, onChange, isDisabled }) {
    return (
        <div key={questionId}>
            <label htmlFor={questionId}>{question}</label>
            <select id={questionId} defaultValue="" onChange={e => onChange(questionId, e.target.value)} disabled={isDisabled}>
                <option value="" disabled>Please select</option>
                {answerOptions.map((option, index) => (
                    <option key={index} value={option}>
                        {option}
                    </option>
                ))}
            </select>
        </div>
    );
}

export function ButtonQuestion({ questionId, question, onChange, isDisabled }) {
    return (
        <div key={questionId}>
            <label htmlFor={questionId}>{question}</label>
            <button onClick={() => onChange(questionId, true)} disabled={isDisabled}>Yes</button>
        </div>
    );
}

export function DateQuestion({ questionId, question, onChange, isDisabled }) {
    return (
      <div>
        <label htmlFor={questionId}>{question}</label>
        <input
          type="month"
          id={questionId}
          onChange={(e) => onChange(questionId, e.target.value)}
          disabled={isDisabled}
        />
      </div>
    );
}

export function DateQuestion2({ questionId, question, onChange, isDisabled }) {
    const handleDateChange = (e) => {
        // Get the selected date
        const selectedDate = new Date(e.target.value);

        // Format the date as MM-DD-YYYY
        const formattedDate =
            (selectedDate.getMonth() + 1).toString().padStart(2, '0') + '-' +
            selectedDate.getDate().toString().padStart(2, '0') + '-' +
            selectedDate.getFullYear();

        onChange(questionId, formattedDate);
    };

    return (
        <div>
            <label htmlFor={questionId}>{question}</label>
            <input
                type="date"
                id={questionId}
                onChange={handleDateChange}
                disabled={isDisabled}
            />
        </div>
    );
}


export function DateQuestion_manual({ questionId, question, answerType, onChange, isDisabled }) {
    // The date format will be handled in the onBlur function
    return (
        <div key={questionId}>
            <label htmlFor={questionId}>{question}</label>
            <input 
                type="text" 
                id={questionId} 
                onBlur={e => handleBlur(e, answerType.type, onChange, questionId)}
                disabled={isDisabled}
            />
        </div>
    );
}

const handleBlur = (e, format, onChange, questionId) => {
    const value = e.target.value;
    let isValid = false;

    // Verify and adjust the date format based on the answerType type
    switch(format) {
        case "date_MM_DD_YYYY":
            isValid = moment(value, "MM-DD-YYYY", true).isValid();
            if (isValid) {
                e.target.value = moment(value, "MM-DD-YYYY").format("MM-DD-YYYY");
                onChange(questionId, e.target.value);
            } else {
                e.target.value = '';
                onChange(questionId, null);
            }
            break;

        // Other date formats can be added here

        default:
            break;
    }

    if (!isValid) {
        alert("Invalid date format. Please enter a date in the format: " + format.slice(5).replace(/_/g, "-"));
    }
}


export function MultipleChoiceQuestion({ questionId, question, answerOptions, onChange, isDisabled }) {
    return (
        <div key={questionId}>
            <label>{question}</label>
            {answerOptions.map((option, index) => (
                <div key={index}>
                    <input 
                        type="radio" 
                        id={`${questionId}-${index}`} 
                        name={questionId} 
                        value={option} 
                        onChange={e => onChange(questionId, e.target.value)} 
                        disabled={isDisabled}
                    />
                    <label htmlFor={`${questionId}-${index}`}>{option}</label>
                </div>
            ))}
        </div>
    );
}
/*
export function StringQuestion({ questionId, question, answerType, onChange, isDisabled }) {
    return (
        <div key={questionId}>
            <label htmlFor={questionId}>{question}</label>
            <input 
                type="text" 
                id={questionId} 
                maxLength={answerType.maxLength} 
                onChange={e => onChange(questionId, e.target.value)} 
                disabled={isDisabled}
            />
        </div>
    );
}
*/
export function StringQuestion({ questionId, question, answerType, onChange, isDisabled }) {
    const maxLength = answerType && typeof answerType === "object" ? answerType.maxLength : undefined;
    
    const inputStyle = {
        width: maxLength ? `${maxLength}ch` : "20ch" // Adjust the width based on maxLength
    };

    return (
        <div key={questionId}>
            <label htmlFor={questionId}>{question}</label>
            <textarea
                id={questionId}
                maxLength={maxLength}
                onChange={e => onChange(questionId, e.target.value)}
                style={inputStyle}
                disabled={isDisabled}
            />
        </div>
    );
}

export function NumberQuestion({ questionId, question, answerType, onChange, isDisabled }) {
    const { format, decimalPlaces, min, max } = answerType;
    const step = format === "percentage" ? Math.pow(10, -decimalPlaces) : 1;

    // This function runs when the input loses focus
    const handleBlur = (e) => {
        let value = parseFloat(e.target.value);

        // If the value is less than the min or greater than the max, fix it
        if (value < min) {
            value = min;
        } else if (value > max) {
            value = max;
        }

        // Ensure the value respects the desired number of decimal places
        value = parseFloat(value.toFixed(decimalPlaces));

        // Update the input field and the component state
        e.target.value = value;
        onChange(questionId, value);
    };

    return (
        <div key={questionId}>
            <label htmlFor={questionId}>{question}</label>
            <input 
                type="number" 
                id={questionId} 
                min={min} 
                max={max} 
                step={step}
                onChange={e => onChange(questionId, e.target.value)} 
                onBlur={handleBlur}
                disabled={isDisabled}
            />
        </div>
    );
}


