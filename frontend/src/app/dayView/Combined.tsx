"use client";

import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";  
import { Line } from "react-chartjs-2";
import { OverlayScrollbarsComponent } from "overlayscrollbars-react";
import { useRef, useEffect, useState } from 'react';
import Switch from '@mui/material/Switch';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export type ActionItemsCalendarViewProps = {
  startTime: string;
  endTime: string;
  name: string;
  id: Id<"actionItems">;
};

export const ActionItemsCalendarView: React.FC<
  ActionItemsCalendarViewProps
  > = ({ startTime, endTime, name, id, showChart }) => {
    const hourHeight = 60; // Height of one hour block in pixels

  const actionItems = useQuery(api.stresses.getByActionItemId, {
    actionItemId: id,
  });
  const formatTime = (isoTime: string) => {
    const date = new Date(isoTime);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    return `${hours < 10 ? `0${hours}` : hours}:${
      minutes < 10 ? `0${minutes}` : minutes
    }`;
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: false,
        text: "Chart.js Line Chart",
      },
    },
  };

  const data = {
    labels: actionItems?.map((item) => formatTime(item.dateTime)), // Assuming dateTime is a string in ISO format
    datasets: [
      {
        label: "Stress Level",
        data: actionItems?.map((item) => item.level), // Assuming level is a numerical value indicating stress
        fill: false,
        backgroundColor: "rgb(75, 192, 192)",
        borderColor: "rgba(75, 192, 192, 0.2)",
      },
    ],
  };
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

  console.log("actionItems", actionItems);

  return (
    <div
      className="absolute bg-[#C4BCFD] p-2 mx-3 rounded-md"
      style={calculateEventStyle(formatTime(startTime), formatTime(endTime))}
    >
      {`${name} (${formatTime(startTime)} - ${formatTime(endTime)})`}

      {showChart && (
        <div
          className="line-chart-container"
          style={{
            width: "1000px",
            height: "100px",
            position: "absolute",
          }}
        >
          <Line options={options} data={data} />;
        </div>
      )}
    </div>
  );
};

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

  // useEffect(() => {
  //   if (scrollRef.current) {
  //     const scrollInstance = scrollRef.current;
  //     scrollInstance.scroll({ y: 8 * 60 }, 0); // Scroll to 8am
  //   }
  // }, []);
  const [showChart, setShowChart] = useState(false);
  return (
    <div className="flex h-full w-full flex-col justify-center items-center bg-white overflow-hidden">
      <h1>Day View Calendar</h1>
      <div style={{ position: 'relative', top: '13px', left: '500px', zIndex: 1000 }}>
        <Switch
          checked={showChart}
          onChange={() => setShowChart(!showChart)}
          name="showChart"
          inputProps={{ 'aria-label': 'secondary checkbox' }}
        />
        <span style={{ color: 'black' }}>{showChart ? 'Hide Chart' : 'Show Chart'}</span>
      </div>
      <div className=" flex flex-col w-full h-max px-10">
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
            { actionItems?.map(({ _id, name, startTime, endTime }, index) => {
              return (
                <ActionItemsCalendarView
                  key={_id}
                  id={_id}
                  name={name}
                  startTime={startTime}
                  endTime={endTime}
                  showChart={showChart}
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
