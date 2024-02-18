import { useState } from 'react';
import { motion } from 'framer-motion';
import StarRating  from './StarRating';
import InputField from './InputField';
import Insights from './Insights';

export const Form = () => {
  const [starRating, setStarRating] = useState(0);
  const [inputValue, setInputValue] = useState<string[]>([]);
  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleValueChange = (value: string[]) => {
    setInputValue(value);
  }

  const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    console.log('Form submitted with:', starRating, inputValue);
    // Add code to send data to the database here
    setFormSubmitted(true);
  }

  const formVariants = {
    initial: {
      opacity: 0,
      y: "100vh"
    },
    in: {
      opacity: 1,
      y: 0
    },
    out: {
      opacity: 0,
      y: "-100vh"
    }
  };

  const insightsVariants = {
    initial: {
      opacity: 0
    },
    in: {
      opacity: 1
    }
  };

  const pageTransition = {
    type: "tween",
    ease: "anticipate",
    duration: 0.5
  };

  return (
    <div className="form-container flex flex-col items-center justify-center min-h-screen">
      {!formSubmitted ? (
        <motion.div
          initial="initial"
          animate="in"
          exit="out"
          variants={formVariants}
          transition={pageTransition}
        >
          <StarRating setRating={setStarRating} />
          <InputField onValueChange={handleValueChange} />
          <button
            onClick={handleSubmit}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 transition duration-300"
          >
            Submit
          </button>
        </motion.div>
      ) : (
        <motion.div
          initial="initial"
          animate="in"
          variants={insightsVariants}
          transition={pageTransition}
        >
          <Insights />
        </motion.div>
      )}
    </div>
  );
};