import React from 'react';

export function SanctionsExposure({ items }) {
  return (
    <>
      {items.map((item, index) => (
        <div key={index}>
          <p>Sanction Exposure Type: {item.sanctionExposureType}</p>
          <p>SanctionExposure Sub Type 1: {item.sanctionExposureSubType1}</p>
          <p>Sanction Exposure Sub Type 2: {item.sanctionExposureSubType2}</p>
          <p>Sanction Exposure Sub Type 3: {item.sanctionExposureSubType3}</p>
        </div>
      ))}
    </>
  );
}