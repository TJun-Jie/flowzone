import React, { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { motion } from "framer-motion";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";

import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import { api } from "../../../../convex/_generated/api";

// Mock data for testing the UI, replace with your actual query
const mockInsights: any = [
  {
    id: 1,
    content:
      "You're stressed between 2-4pm when you're having this activity, remember to take a break and unwind during these times.",
  },
];

const mockActionableInsights: any = [
  {
    actionItemId: "a1",
    name: "Attend Time Management Workshop",
    priority: "High",
    dueDate: "2024-03-01",
    status: "Scheduled",
    isDone: false,
    projects: ["Personal Development"],
    startTime: "2024-02-18T09:00:00-08:00",
    endTime: "2024-02-18T12:00:00-08:00",
    location: {
      latitude: 40.7128,
      longitude: -74.006,
      name: "Downtown Conference Center",
    },
    notes:
      "Participating in a time management workshop to better allocate time for meals, exercise, and relaxation, ensuring a balanced approach to daily activities.",
    stress: [2,2,2,1,1,1],
    distractions: ["unnecessary_meetings", "prolonged_breaks"],
  },
  {
    actionItemId: "b2",
    name: "Complete Advanced Project Management Course",
    priority: "Medium",
    dueDate: "2024-04-15",
    status: "Not Started",
    isDone: false,
    projects: ["Skill Upgradation"],
    startTime: "2024-02-18T18:00:00-08:00",
    endTime: "2024-02-18T20:00:00-08:00",
    location: {
      latitude: 37.7749,
      longitude: -122.4194,
      name: "Online Platform",
    },
    notes:
      "Enrolling in an advanced project management course to improve planning, execution, and delivery of projects. Goal is to consistently meet or exceed project timelines with efficient resource management.",
    stress: [2,2,2,1,1,1],
    distractions: ["inefficient_workflow", "lack_of_resources"],
  },
  {
    actionItemId: "c3",
    name: "Establish Regular Morning Exercise Routine Before Work",
    priority: "High",
    dueDate: "2024-02-28",
    status: "InProgress",
    isDone: false,
    projects: ["Health Improvement"],
    startTime: "2024-02-18T08:00:00-08:00",
    endTime: "2024-02-18T08:30:00-08:00",
    location: {
      latitude: 34.0522,
      longitude: -118.2437,
      name: "Local Gym",
    },
    notes:
      "Committing to a daily morning exercise routine to enhance physical health, reduce stress, and increase energy levels throughout the day. This routine includes cardio, strength training, and flexibility exercises.",
    stress: [2,2,2,1,1,1],
    distractions: ["morning_lethargy", "postponement"],
  },
];

const Insights = () => {
  const insightsVariants = {
    initial: { opacity: 0 },
    in: { opacity: 1 },
  };

  const pageTransition = {
    type: "tween",
    ease: "anticipate",
    duration: 0.5,
  };

  // Replace with actual query in production
  // const insights = useQuery(api.getInsights);
  const [insights, setInsights] = useState(mockInsights);
  const [actionableInsights, setActionableInsights] = useState(
    mockActionableInsights
  );
  const addActionItem = useMutation(api.actionItems.createActionItem);

  const handleReject = (name: string) => {
    setActionableInsights((prevInsights: any[]) =>
      prevInsights.filter((insight) => insight.name !== name)
    );
  };

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
          <span role="img" aria-label="bulb" className="text-2xl">
            💡
          </span>
          <h2 className="text-xl font-bold ml-2">General Insights</h2>
        </div>
        {insights && (
          <div>
            {insights.map((insight: any) => (
              <Paper key={insight.id} className="p-4 mb-4" elevation={2}>
                <p>{insight.content}</p>
              </Paper>
            ))}
          </div>
        )}
        <div className="flex items-center mb-4 pt-2">
          <span role="img" aria-label="wrench" className="text-2xl">
            🔧
          </span>
          <h2 className="text-xl font-bold ml-2">Actionable Insights</h2>
        </div>
        {actionableInsights && (
          <div>
            {actionableInsights.map((insight: any) => (
              <Paper
                key={insight.name}
                className="flex flex-col items-start justify-between p-4 mb-4"
                elevation={2}
              >
                <h2 style={{ fontWeight: 600 }}>{insight.name}</h2>
                <p>{insight.notes}</p>

                <div className="flex justify-end w-full h-[30px]">
                  <IconButton
                    color="primary"
                    aria-label="accept"
                    onClick={() => addActionItem(insight)}
                  >
                    <CheckCircleIcon />
                  </IconButton>
                  <IconButton
                    color="secondary"
                    aria-label="reject"
                    onClick={() => handleReject(insight.name)}
                  >
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
};

export default Insights;
