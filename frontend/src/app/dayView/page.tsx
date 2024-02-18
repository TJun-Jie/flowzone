"use client";
import { useQuery } from "convex/react";
import { OverlayScrollbarsComponent } from "overlayscrollbars-react";
import { api } from "../../../convex/_generated/api";

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
  const hourHeight = 60; // Height of one hour block in pixels
  const actionItems = useQuery(api.actionItems.get);
  console.log(actionItems);

  // Function to calculate the height and top margin of an event block
  const calculateEventStyle = (startTime: string, endTime: string) => {
    const startHour = parseInt(startTime.split(":")[0], 10);
    const startMinutes = parseInt(startTime.split(":")[1], 10);
    const endHour = parseInt(endTime.split(":")[0], 10);
    const endMinutes = parseInt(endTime.split(":")[1], 10);

    const startPosition =
      startHour * hourHeight + (startMinutes / 60) * hourHeight;
    const endPosition = endHour * hourHeight + (endMinutes / 60) * hourHeight;
    const height = endPosition - startPosition;

    return {
      marginTop: `${startPosition + 10}px`,
      marginLeft: "120px",
      height: `${height}px`,
      width: "87%",
      display: "flex",
      alignItems: "center",
    };
  };
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
              const formatTime = (isoTime: string) => {
                const date = new Date(isoTime);
                const hours = date.getHours();
                const minutes = date.getMinutes();
                return `${hours < 10 ? `0${hours}` : hours}:${
                  minutes < 10 ? `0${minutes}` : minutes
                }`;
              };
              console.log(formatTime(startTime), formatTime(endTime));

              return (
                <div
                  key={index}
                  className="absolute bg-[#C4BCFD] p-2 mx-3 rounded-md"
                  style={calculateEventStyle(
                    formatTime(startTime),
                    formatTime(endTime)
                  )}
                >
                  {`${name} (${formatTime(startTime)} - ${formatTime(
                    endTime
                  )})`}
                </div>
              );
            })}
          </div>
        </OverlayScrollbarsComponent>
      </div>
    </div>
  );
};

export default DayViewCalendar;
