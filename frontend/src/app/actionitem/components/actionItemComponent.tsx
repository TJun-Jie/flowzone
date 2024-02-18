// actionItemComponent.tsx

"use client"; // This is a client component 👈🏽

import React from 'react';

const ActionItemComponent = ({ name, priority, doDate, done, status, note }:any) => {
  // Render your action item layout here
  return (
    <div className="action-item">
      <div>{name}</div>
      <div>{priority}</div>
      <div>{doDate}</div>
      <div>{done ? 'Done' : 'Not Done'}</div>
      <div>{status}</div>
      <div>{note}</div>
    </div>
  );
};

export default ActionItemComponent;