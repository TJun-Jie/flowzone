import React from 'react';
import { useQuery } from "convex/react";
import { motion } from "framer-motion";
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/Icon';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';

// Define the structure of your insights as an array of strings
interface InsightItem {
  id: number;
  content: string;
}

// Mock data for testing the UI, replace with your actual query
const mockInsights: InsightItem[] = [
  {
    id: 1,
    content: "You're stressed between 2-4pm when you're having this activity, remember to take a break and unwind during these times."
  },
  {
    id: 2,
    content: "You're stressed between 2-4pm when you're having this activity, remember to take a break and unwind during these times."
  },
  // ... more insights
];

const Insights = () => {
  const insightsVariants = {
    initial: { opacity: 0 },
    in: { opacity: 1 }
  };

  const pageTransition = {
    type: "tween",
    ease: "anticipate",
    duration: 0.5
  };

  // Replace with actual query in production
  // const insights = useQuery(api.getInsights);
  const insights = { data: mockInsights, isLoading: false, error: null };

  return (
    <motion.div
      className="flex h-full w-full bg-yellow-300 rounded-xl overflow-hidden shadow-lg"
      initial="initial"
      animate="in"
      variants={insightsVariants}
      transition={pageTransition}
    >
      <Paper elevation={3} className="flex flex-col flex-grow p-4">
        <div className="flex items-center mb-4">
          <span role="img" aria-label="bulb" className="text-2xl">💡</span>
          <h2 className="text-xl font-bold ml-2">General Insights</h2>
        </div>
        {insights.isLoading && <p>Loading...</p>}
        {insights.data && (
          <div>
            {insights.data.map((insight) => (
              <Paper key={insight.id} className="p-4 mb-4" elevation={2}>
                <p>{insight.content}</p>
              </Paper>
            ))}
          </div>
        )}
        <div className="flex items-center mb-4 pt-2">
          <span role="img" aria-label="wrench" className="text-2xl">🔧</span>
          <h2 className="text-xl font-bold ml-2">Actionable Insights</h2>
        </div>
        {/* Here we're repeating the same insights for actionable items, replace with your actual actionable insights */}
        {insights.data && (
          <div>
            {insights.data.map((insight) => (
              <Paper key={insight.id} className="flex items-center justify-between p-4 mb-4" elevation={2}>
                <p>{insight.content}</p>
                <div className="flex">
                <IconButton color="primary" aria-label="accept" onClick={() => console.log("Hi")}>
                  <CheckCircleIcon />
                </IconButton>
                <IconButton color="secondary" aria-label="reject" onClick={() => console.log("Rejected")}>
                  <CancelIcon />
                </IconButton>
                </div>
              </Paper>
            ))}
          </div>
        )}
      </Paper>
    </motion.div>
  );
}

export default Insights;
