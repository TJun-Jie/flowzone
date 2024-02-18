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

const ActionItemsCalendarView: React.FC<ActionItemsCalendarViewProps> = ({
  startTime,
  endTime,
  name,
  id,
}) => {
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
        display: true,
        text: `${name} (${formatTime(startTime)} - ${formatTime(endTime)})`,
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
      {/* {`${name} (${formatTime(startTime)} - ${formatTime(endTime)})`} */}

      {actionItems && actionItems.length > 0 && (
        <div
          className="line-chart-container"
          style={{
            width: "calc(100% - 20px)",
            height: "100%",
            position: "absolute",
          }}
        >
          <Line options={options} data={data} />;
        </div>
      )}
    </div>
  );
};

export default ActionItemsCalendarView;
