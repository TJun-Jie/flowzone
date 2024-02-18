"use client";
import { useQuery } from "convex/react";
import { OverlayScrollbarsComponent } from "overlayscrollbars-react";
import { api } from "../../../convex/_generated/api";
import ActionItemsCalendarView from "./ActionItemsCalendarView";

export type DayViewCalendarProps = {
  events?: {
    title: string;
    startTime: string;
    endTime: string;
  }[];
};

const sampleEvents = [
  {
    title: "Morning Meeting",
    startTime: "09:00",
    endTime: "10:00",
  },
  {
    title: "Project Discussion",
    startTime: "11:15",
    endTime: "12:45",
  },
  {
    title: "Lunch Break",
    startTime: "13:00",
    endTime: "14:00",
  },
  {
    title: "Client Call",
    startTime: "15:30",
    endTime: "16:00",
  },
  {
    title: "Review Session",
    startTime: "17:00",
    endTime: "18:30",
  },
];
const DayViewCalendar: React.FC<DayViewCalendarProps> = ({
  events = sampleEvents,
}) => {
  const actionItems = useQuery(api.actionItems.get);

  return (
    <div className="flex w-screen h-screen flex-col justify-center items-center bg-white overflow-hidden">
      <h1>Day View Calendar</h1>
      <div className=" flex flex-col w-full h-max px-10 fixed">
        <OverlayScrollbarsComponent className="w-full h-full ">
          <div className="h-[700px] w-full flex flex-col gap-[40px] relative ">
            {Array.from({ length: 25 }).map((_, index) => {
              if (index === 24) {
                return (
                  <div className="flex w-full h-[20px]" key={index}>
                    <div className="w-[70px] opacity-0">12 pm</div>
                    <div className="h-full w-full flex justify-center items-center mt-[3px] ml-10 mr-4">
                      <div className="w-full border-b-[1px] h-max border-neutral-300"></div>
                    </div>
                  </div>
                );
              }
              return (
                <div className="flex w-full h-[20px]" key={index}>
                  <div className="w-[70px] text-black">
                    {index === 0
                      ? "12 am"
                      : index < 12
                      ? `${index} am`
                      : index === 12
                      ? "12 pm"
                      : `${index - 12} pm`}
                  </div>
                  <div className="h-full w-full flex justify-center items-center  ml-10 mr-4">
                    <div className="w-full border-b-[1px] h-max border-neutral-300"></div>
                  </div>
                </div>
              );
            })}
            {actionItems?.map(({ _id, name, startTime, endTime }, index) => {
              return (
                <ActionItemsCalendarView
                  key={_id}
                  id={_id}
                  name={name}
                  startTime={startTime}
                  endTime={endTime}
                />
              );
            })}
          </div>
        </OverlayScrollbarsComponent>
      </div>
    </div>
  );
};

export default DayViewCalendar;
