"use client";

import { useQuery } from "convex/react";
import MainComponent from "./components/mainComponent";
import { api } from "../../../convex/_generated/api";

export type ActionItemPage = {};

const ActionItemPage: React.FC = () => {
  return (
    <div className="flex flex-col w-full items-center mt-5">
      <div className="flex justify-center w-full align-center text-[20px]  font-medium mb-2">
        Action Items
      </div>
      <MainComponent />
    </div>
  );
};

export default ActionItemPage;
