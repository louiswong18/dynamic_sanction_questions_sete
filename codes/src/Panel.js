import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';


function Panel({ title, questions, answers, sanctionExposure, onDelete, isExpanded: propIsExpanded }) {
    const [isExpanded, setIsExpanded] = useState(false);

    useEffect(() => {
        setIsExpanded(propIsExpanded);
    }, [propIsExpanded]);

    function handleDelete() {
        onDelete();
    }

    function handleToggleExpand() {
        setIsExpanded(!isExpanded);
    }

    return (
        <div className="panel panel-default">
            <div className="panel-heading" onClick={handleToggleExpand}>
                <h2 className="panel-title">
                    <span className={`glyphicon glyphicon-chevron-${isExpanded ? 'down' : 'right'}`}></span>
                    {isExpanded ? '-' : '+'} {title}
                </h2>
            </div>
            {isExpanded && (
                <div className="panel-body">
                    {/* Table for Questions and Answers */}
                    <h3>Questions and Answers</h3>
                    <table className="table table-bordered table-condensed table-striped">
                        <thead>
                            <tr>
                                <th>Question Id</th>
                                <th>Question</th>
                                <th>Answer</th>
                            </tr>
                        </thead>
                        <tbody>
                            {questions.map((question, index) => (
                                <tr key={index}>
                                    <td>{question.questionId}</td>
                                    <td>{question.question}</td>                                    
                                    <td>{answers[question.questionId] !== undefined ? String(answers[question.questionId]) : 'N/A'}</td>
                                </tr>
                            ))}                            
                        </tbody>
                    </table>

                    {/* Table for Sanction Exposure */}
                    <h3>Sanction Exposure</h3>
                    <table className="table table-bordered table-condensed table-striped">
                        <thead>
                            <tr>
                                <th>Sanction Exposure Type</th>
                                <th>Sanction Exposure Sub Type 1</th>
                                <th>Sanction Exposure Sub Type 2</th>
                                <th>Sanction Exposure Sub Type 3</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sanctionExposure.map((sanction, idx) => (
                                <tr key={idx}>
                                    <td>{sanction.sanctionExposureType}</td>
                                    <td>{sanction.sanctionExposureSubType1}</td>
                                    <td>{sanction.sanctionExposureSubType2}</td>
                                    <td>{sanction.sanctionExposureSubType3}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <button onClick={handleDelete}>Delete</button>
                </div>
            )}
        </div>
    );
}

export default Panel;