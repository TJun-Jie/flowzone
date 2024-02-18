import React from "react";
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
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Doc } from "../../convex/_generated/dataModel";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "top" as const,
    },
    title: {
      display: true,
      text: "Sleep Data",
    },
  },
  scales: {
    y: {
      suggestedMin: 0,
      suggestedMax: 100,
    },
  },
};

const labels = ["12am", "1am", "2am", "3am", "4am", "5am", "6am", "7am", "8am"];

export default function SleepGraph() {
  const sleepScores = useQuery(api.sleepScores.getSleepScores);

  const data = {
    labels,
    datasets: [
      {
        label: "02/18/2024",
        data: sleepScores?.map((score: Doc<"sleepScores">) => score.score),
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
    ],
  };
  return <Line options={options} data={data} />;
}
