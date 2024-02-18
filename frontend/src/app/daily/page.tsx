"use client";

import React, { useState } from "react";
import DayViewCalendar from "../dayView/Combined";

import { Form } from "./components/Form";

const DailyInsightsPage = () => {
  return (
    <div className="p-4">
      <div className="flex">
        <div style={{width:"25%", height:"100vh",}} >
          <Form />
        </div>
        <div style={{width:"85%", height:"100vh", overflow:"scroll" }}>
          <DayViewCalendar />
        </div>
      </div>
    </div>
  );
}

export default DailyInsightsPage;