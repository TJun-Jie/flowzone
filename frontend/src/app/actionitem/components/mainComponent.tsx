// mainComponent.tsx

"use client"; // This is a client component 👈🏽
import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import ActionItemComponent from './actionItemComponent';

// Dynamically import the ResponsiveGridLayout with SSR set to false
const ResponsiveGridLayout = dynamic(() => import('react-grid-layout'), { ssr: false });


const MainComponent = () => {
  // This state would typically come from a backend like Convex
  const [actionItems, setActionItems] = useState([
    // This would be fetched from the database
    { id: 1, name: 'Under 5 min. Quick Action', priority: 'Quick Task', doDate: 'November 9, 2022', done: false, status: 'Active', note: '' },
    // Add more items as needed
  ]);

  // Define the layout for the grid
  const layouts = {
    lg: actionItems.map((item, index) => ({ i: item.id.toString(), x: 0, y: index, w: 1, h: 1 })),
    // Add more breakpoints as needed
  };

  return (
    <ResponsiveGridLayout
      className="layout"
      layouts={layouts}
      breakpoints={{ lg: 1200 }}
      cols={{ lg: 12 }}
    >
      {actionItems.map(item => (
        <div key={item.id}>
          <ActionItemComponent {...item} />
        </div>
      ))}
    </ResponsiveGridLayout>
  );
};

export default MainComponent;
