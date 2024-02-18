"use client";

import { useQuery } from "convex/react";
import MainComponent from "./components/mainComponent";
import { api } from "../../../convex/_generated/api";

export type ActionItemPage = {};

const ActionItemPage: React.FC = () => {
  return (
    <div className="flex flex-col w-full items-center mt-5">
      <h1>Action Items</h1>
      <MainComponent />
    </div>
  );
};

export default ActionItemPage;
