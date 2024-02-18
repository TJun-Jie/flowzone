"use client";

import React, { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";

import { Form } from "./components/Form";

const DailyInsightsPage = () => {
  return (
    <div className="App p-4">
      <div className="form-container">
        <div style={{ flex: '0 0 25%' }}>
          <Form />
        </div>
      </div>
    </div>
  );
}

export default DailyInsightsPage;