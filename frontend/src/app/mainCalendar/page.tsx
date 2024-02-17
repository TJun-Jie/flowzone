"use client";
import React, { useState } from "react";
import OperationsContext from "./context/OperationsContext";
import Chat from "./components/Chat";
import EventCalendar from "./components/EventCalendar";
import { OverlayScrollbarsComponent } from "overlayscrollbars-react";

function MainCalendar() {
  const [operations, setOperations] = useState<string[] | null>(null);

  return (
    <OperationsContext.Provider value={{ operations, setOperations }}>
      <div className="flex flex-row h-full bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-400 ">
        <div className="w-4/5 h-full">
          <OverlayScrollbarsComponent defer className="h-full ">
            <div style={{ height: "calc(100vh - 56px)" }}>
              <EventCalendar />
            </div>
          </OverlayScrollbarsComponent>
        </div>
        <div className="w-1/5 h-full">
          <Chat />
        </div>
      </div>
    </OperationsContext.Provider>
  );
}

export default MainCalendar;
