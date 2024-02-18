  import React, { useState } from 'react';
  import Box from '@mui/material/Box';
  import TextField from '@mui/material/TextField';

  interface BulletPointsTextAreaProps {
    label: string;
    value: string;
    onTextChange: (text: string) => void;
  }

  const BulletPointsTextArea: React.FC<BulletPointsTextAreaProps> = ({ label, value, onTextChange }) => {
    const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault(); // Prevent the default action to avoid the double line break
        const newValue = `${value.trimEnd()}\n• `;
        onTextChange(newValue);
      }
    };

    const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      onTextChange(event.target.value);
    };

    return (
      <TextField
        label={label}
        multiline
        minRows={5}
        variant="outlined"
        fullWidth
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        sx={{ margin: 1, width: 'calc(50% - 8px)' }} // Adjusted width for side by side layout
      />
    );
  };

  const InputField = ({ onValueChange }: { onValueChange: (value: string[]) => void }) => {
    const [wins, setWins] = useState('• ');
    const [losses, setLosses] = useState('• ');

    return (
      <Box display="flex" justifyContent="space-between" sx={{ width: '100%', maxWidth: '800px', flexWrap: 'wrap' }}>
        <BulletPointsTextArea label="Wins" value={wins} onTextChange={setWins} />
        <BulletPointsTextArea label="Losses" value={losses} onTextChange={setLosses} />
      </Box>
    );
  }

  export default InputField;
