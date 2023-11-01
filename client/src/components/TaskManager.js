import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';
import TaskView from './TaskView';

function TaskManager() {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/'); // Navigate back to the home page
  };

  return (
    <div>
      <h1>Task Manager</h1>
      {/* Your task manager content goes here */}

      <Button onClick={handleBack} variant="contained" color="primary">
        Back to Home
      </Button>
      <TaskView />
    </div>
  );
}

export default TaskManager;
