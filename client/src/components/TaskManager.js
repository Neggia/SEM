import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';
import ProcessView from './ProcessView';
import TaskView from './TaskView';

// import ReactTabulatorExample from './ReactTabulatorExample';

function TaskManager() {
  const navigate = useNavigate();
  const [processData, setProcessData] = useState(null);
  const [taskData, setTaskData] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const processResponse = await fetch('http://localhost:3000/process');
        if (!processResponse.ok) {
          throw new Error(
            'Network response was not ok ' + processResponse.statusText,
          );
        }
        const processResponseJson = await processResponse.json();
        console.log(
          'TaskManager processDataResponseJson: ',
          processResponseJson,
        );
        setProcessData(processResponseJson);

        // const lastId = data[data.length - 1].id;
        // console.log('ProcessView lastId: ', lastId);
        // setLastId(lastId);
        let tasks = [];
        let tasksResponse;
        let tasksResponseJson;
        for (const process of processResponseJson) {
          tasksResponse = null;
          tasksResponseJson = null;

          tasksResponse = await fetch(
            'http://localhost:3000/process/' + process.id,
          );
          if (!tasksResponse.ok) {
            throw new Error(
              'Network response was not ok ' + tasksResponse.statusText,
            );
          }
          tasksResponseJson = await tasksResponse.json();
          console.log('TaskManager tasksResponseJson: ', tasksResponseJson);

          const updatedWebsites = tasksResponseJson.websites.map(
            (obj, index) => {
              return {
                ...obj,
                pid: process.id,
                progress: (obj.last_page / obj.num_pages) * 100,
              };
            },
          );
          // if (
          //   Array.isArray(tasks) &&
          //   Array.isArray(tasksResponseJson.websites)
          // ) {
          tasks = tasks.concat(updatedWebsites);
          // tasks([...tasks, ...tasksResponseJson.websites]);
          // } else {
          //   console.error('One of the objects is not an array');
          // }
          // console.log('TaskManager tasks: ', tasks);
        }

        console.log('TaskManager tasks: ', tasks);
        setTaskData(tasks);
      } catch (error) {
        console.error(
          'There has been a problem with your fetch operation:',
          error,
        );
      }
    }

    fetchData();
  }, []);

  const handleBack = () => {
    navigate('/'); // Navigate back to the home page
  };

  if (processData === null) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Task Manager</h1>
      {/* Your task manager content goes here */}

      <Button onClick={handleBack} variant="contained" color="primary">
        Back to Home
      </Button>
      {processData && <ProcessView processData={processData} />}
      {taskData && <TaskView taskData={taskData} />}
      {/* <ReactTabulatorExample /> */}
    </div>
  );
}

export default TaskManager;
