'use client'

import MainComponent from "./components/mainComponent";

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