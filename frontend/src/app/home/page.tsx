"use client";
import DayViewCalendar from "../dayView/Combined";
import ActionItemPage from "../actionitem/page";
import Insights from "../daily/components/Insights";
import SleepGraph from "@/components/SleepGraph";

const Home = () => {
  return (
    <div className="p-4 h-full w-full">
      <div className="flex flex-col">
        <div className="h-[500px] w-full">
          <ActionItemPage />
        </div>
        <div className="flex justify-center w-full align-center text-[20px] font-medium  mb-2">
          Calendar
        </div>
        <div
          style={{ width: "70%", height: "700px", overflow: "scroll" }}
          className="mx-auto "
        >
          <DayViewCalendar />
        </div>
        <div className="w-[70%] mx-auto mt-10">
          <SleepGraph />
        </div>
        <div className="w-[70%] mx-auto mt-10">
          <div className="flex justify-center w-full align-center text-[20px] font-medium  mb-2">
            Insights
          </div>
          <Insights />
        </div>
      </div>
    </div>
  );
};

export default Home;
