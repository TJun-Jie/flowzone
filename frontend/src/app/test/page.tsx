"use client";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  LinearProgress,
  Tooltip,
  Typography,
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

import React, { useState } from "react";
import { useQuery, useAction } from "convex/react";
import { api } from "../../../convex/_generated/api";
// import { useUser } from "@clerk/nextjs";


const CreateProjectPage = () => {
  const performMyAction = useAction(api.getUpdatedCalendar.amendActionItems);
  const handleClick = () => {
    performMyAction({ project: "Hello, are you there" });
  };

  return (
    <button onClick={handleClick}>test</button>
    // <div className="min-h-screen bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-400">
    //   <div className="text-center pt-10">
    //     <h1 className="text-4xl font-bold text-white mb-4">Goals</h1>
    //     <p className="text-lg text-white mb-8">
    //       What would you like to accomplish today
    //     </p>
    //     {goals?.map(({ _id, text }) => (
    //     <div key={_id}>{text}</div>
    //   ))}
    //     <div className="max-w-xl mx-auto p-8 bg-white rounded-lg shadow-lg">
    //       <div className="flex flex-col text-left">
    //         <div className="block mb-2 ml-1 text-sm text-left w-full text-gray-900 dark:text-gray-300 self-center font-bold ">
    //           Prompt
    //         </div>
    //         <input
    //           type="text"
    //           value={goalInput}
    //           onChange={(e) => setGoalInput(e.target.value)}
    //           placeholder="Type a goal"
    //           className="w-full border-2 border-gray-200 p-4 rounded-lg  text-black"
    //         />
    //       </div>
    //     </div>
    //   </div>
    // </div>
  );
};

export default CreateProjectPage;
