import React from 'react';
import Panel from './Panel';

export function Panels({ panels, handleDeletePanel }) {
    return (
        <div>
            {panels.map((panel, index) => (
                <Panel
                    key={index}
                    title={`Panel ${index + 1}: ${panel.title}`}
                    questions={panel.questions} // Added this line
                    answers={panel.answers}
                    sanctionExposure={panel.sanctionExposure}
                    onDelete={() => handleDeletePanel(index)}
                    isExpanded={panel.isExpanded}
                />
            ))}
        </div>
    );
}