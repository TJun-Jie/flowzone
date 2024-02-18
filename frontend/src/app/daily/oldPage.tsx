/*
User input page (non-expanded):
1. Connect data from CY actions to frontend (copy from his)
    - Prefilled with completed tasks, possibly based on locations
2. Add user daily rating from 1-5 stars
3. Add user input text box with voice to text
4. Add save button 

Insights page (expanded):
1. Transition sliding down, with possible background color change based on mood 
2. Show health data chart on left
3. Show key actionable insights on right 
*/

'use client'
import { useUser } from '@clerk/nextjs';
//import actionList from './actions';
import React, { useEffect, useRef, useState } from 'react';

//import TodoList from '../actionItems/page.tsx';
import Form from './components/Form';
import HealthChart from './components/HealthChart';
import Insights from './components/Insights';


const DailyInsights: React.FC<null> = () => {
  const user = useUser();
  const [actions, setActions] = useState([]);
  const [actionList, setActionList] = useState(null); // actionList from CY
  const [starRating, setStarRating] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Transition into insights page
  const [moodColor, setMoodColor] = useState(''); // Change background color based on mood
  const [healthData, setHealthData] = useState([]); // Health data from Terra
  const [insights, setInsights] = useState([]); // Insights from backend

  const handleSubmit = (e: Event) => {
    e.preventDefault();
    // Scroll to insights (assuming an element with ID 'insights' exists)
    document.getElementById('insights')?.scrollIntoView({ behavior: 'smooth' });
  };

    return (
      <div className="App p-4">
        <div className="form-container">
          <TodoList />
          <StarRating />
          <VoiceInput />
          <button
            onClick={handleSubmit}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 transition duration-300"
          >
            Submit
          </button>
        </div>
        {/* Placeholder for insights section */}
        <div id="insights" className="mt-10">
          <h2 className="text-xl font-bold">Insights</h2>
          {/* Your insights content goes here */}
        </div>
      </div>
    );
}

export default DailyInsights;