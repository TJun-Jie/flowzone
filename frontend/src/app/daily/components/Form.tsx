import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import StarRating from "./StarRating";
import InputField from "./InputField";
import Insights from "./Insights";
import { useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import LinearProgress from "@mui/material/LinearProgress";

export const Form = () => {
  const [starRating, setStarRating] = useState(0);
  const [inputValue, setInputValue] = useState<string[]>([]);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const createUserInput = useMutation(api.dailyMetrics.createDailyMetrics);
  const [terraData, setTerraData] = useState(null);
  const [showProgress, setShowProgress] = useState(false);

  const handleValueChange = (value: string[]) => {
    setInputValue(value);
  };

  const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    console.log("Form submitted with:", starRating, inputValue);
    createUserInput({
      date: new Date().toISOString(),
      ratingOfDay: starRating,
      wins: inputValue[0]
        .split("\n")
        .map((line) => line.replace(/^\s*•\s*/, "").trim()),
      losses: inputValue[1]
        .split("\n")
        .map((line) => line.replace(/^\s*•\s*/, "").trim()),
      weight: 160,
      actionItemsCompleted: [],
      sleepHours: 7,
    });
    setShowProgress(true);
    setTimeout(() => {
      setShowProgress(false);
      setFormSubmitted(true);
    }, 800);
  };

  const formVariants = {
    initial: {
      opacity: 0,
      y: "100vh",
    },
    in: {
      opacity: 1,
      y: 0,
    },
    out: {
      opacity: 0,
      y: "-100vh",
    },
  };

  const insightsVariants = {
    initial: {
      opacity: 0,
    },
    in: {
      opacity: 1,
    },
  };

  const pageTransition = {
    type: "tween",
    ease: "anticipate",
    duration: 0.5,
  };

  useEffect(() => {
    fetch("https://2a82-171-66-12-5.ngrok-free.app/consumeTerraWebhook")
      .then((response) => response.json())
      .then((data) => setTerraData(data))
      .catch((error) => console.error("Error:", error));
  }, []);

  return (
    <>
      {!formSubmitted ? (
        <div className="flex flex-col items-start justify-start w-[300px] h-full mr-[20px]">
          <motion.div
            initial="initial"
            animate="in"
            exit="out"
            variants={formVariants}
            transition={pageTransition}
            className="  p-4 rounded-lg h-full bg-white "
            style={{ backgroundColor: "rgba(255, 255, 255, 0.9)" }}
          >
            <div className="border-b border-black pb-4 flex justify-center">
              <StarRating setRating={setStarRating} />
            </div>
            <div className="border-b border-black py-4">
              <InputField onValueChange={handleValueChange} />
            </div>
            <div className="pt-4 flex justify-center">
              <button
                onClick={handleSubmit}
                className="px-2 mx-4 bg-blue-500 text-white font-semibold rounded hover:bg-blue-500 transition duration-300"
              >
                Submit
              </button>
            </div>
            {showProgress && (
              <div style={{ marginTop: "8px" }}>
                <LinearProgress />
              </div>
            )}
          </motion.div>
        </div>
      ) : null}
      {formSubmitted && (
        <div
          className="insights-container"
          style={{ width: "95%", marginLeft: "0", marginTop: "0" }}
        >
          <motion.div
            initial="initial"
            animate="in"
            variants={insightsVariants}
            transition={pageTransition}
            className="flex justify-center"
          >
            <Insights />
          </motion.div>
        </div>
      )}
    </>
  );
};
