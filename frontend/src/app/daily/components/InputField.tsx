import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import exp from 'constants';

interface BulletPointsTextAreaProps {
  label: string;
  onTextChange: (text: string) => void;
}

const BulletPointsTextArea: React.FC<BulletPointsTextAreaProps> = ({ label, onTextChange }) => {
  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    // Ensuring bullet points are correctly applied to each new line
    let lines = event.target.value.split('\n');
    let bulletPointText = lines.map(line => line.trim().startsWith('•') ? line : `• ${line.trim()}`).join('\n');
    onTextChange(bulletPointText);
  };

  return (
    <TextField
      label={label}
      multiline
      minRows={5}
      variant="outlined"
      fullWidth
      onChange={handleChange}
      sx={{ margin: 1, maxWidth: 'calc(47%)' }} // Adjust the maxWidth to ensure side by side layout
    />
  );
};

interface InputFieldProps {
  onValueChange: (text: string[]) => void;
}

const InputField = (props: InputFieldProps) => {
  const [wins, setWins] = useState('');
  const [losses, setLosses] = useState('');

  useEffect(() => {
    props.onValueChange([wins, losses]);
  }, [wins, losses]);

  return (
    <Box display="flex" flexDirection="column" alignItems="center" sx={{ width: '100%' }}>
      <Box display="flex" justifyContent="space-between" sx={{ width: '100%', maxWidth: '800px', flexWrap: 'wrap' }}>
        <BulletPointsTextArea label="Wins" onTextChange={setWins} />
        <BulletPointsTextArea label="Losses" onTextChange={setLosses} />
      </Box>
    </Box>
  );
}

export default InputField;