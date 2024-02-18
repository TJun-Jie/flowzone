"use client";

import React, { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";

import { Form } from "./components/Form";

const DailyInsightsPage = () => {
  return (
    <div className="App p-4 bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-400">
      <div className="form-container">
        <Form />
      </div>
      {/* Placeholder for insights section */}
      <div id="insights" className="mt-10">
        <h2 className="text-xl font-bold">Insights</h2>
      </div>
    </div>
  );
}

export default DailyInsightsPage;