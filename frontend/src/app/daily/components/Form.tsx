import { useState } from 'react';
import StarRating  from './StarRating';
import InputField from './InputField';

export const Form = () => {
  const [starRating, setStarRating] = useState(0);
  const [inputValue, setInputValue] = useState<string[]>([]);

  const handleValueChange = (value: string[]) => {
    setInputValue(value);
  }

  const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    console.log('Form submitted with:', starRating, inputValue);
    // Add code to send data to the database here
  }
  
  return (
    <div className="form-container flex flex-col items-center justify-center min-h-screen">
      <StarRating setRating={setStarRating} />
      <InputField onValueChange={handleValueChange} />
      <button
        onClick={handleSubmit}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 transition duration-300"
      >
        Submit
      </button>
    </div>
  );
};