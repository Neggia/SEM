import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';
import ProcessView from './ProcessView';
import TaskView from './TaskView';
import OpenaiCompletionsView from './OpenaiCompletionsView';
import {
  SERVER_BASE_URL,
  CONTROLLER_SERVICE_OPENAI_ID,
  CONTROLLER_SERVICE_OPENAI_GET_PRODUCT_STRUCTURE,
  CONTROLLER_SERVICE_OPENAI_GET_FUNCTIONS,
  CONTROLLER_PROCESS_ID,
  CONTROLLER_OPENAI_COMPLETIONS_ID,
} from '../utils/globals';

// import ReactTabulatorExample from './ReactTabulatorExample';

function TaskManager() {
  const navigate = useNavigate();
  const [processData, setProcessData] = useState(null);
  const [taskData, setTaskData] = useState(null);
  const [openaiCompletionsData, setOpenaiCompletionsData] = useState(null);
  const [openaiServiceFunctionsData, setOpenaiServiceFunctions] =
    useState(null);
  // const [pids, setPids] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const processResponse = await fetch(
          SERVER_BASE_URL + CONTROLLER_PROCESS_ID,
        );
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
        let pidsArray = [];
        let tasksResponse;
        let tasksResponseJson;
        for (const process of processResponseJson) {
          tasksResponse = null;
          tasksResponseJson = null;

          pidsArray.push(process.id);

          tasksResponse = await fetch(
            SERVER_BASE_URL + CONTROLLER_PROCESS_ID + '/' + process.id,
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
                product_structure: '',
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
        // setPids(pidsArray);

        const openaiCompletionsResponse = await fetch(
          SERVER_BASE_URL + CONTROLLER_OPENAI_COMPLETIONS_ID,
        );
        if (!openaiCompletionsResponse.ok) {
          throw new Error(
            'Network response was not ok ' +
              openaiCompletionsResponse.statusText,
          );
        }
        const openaiCompletionsResponseJson =
          await openaiCompletionsResponse.json();
        console.log(
          'TaskManager openaiCompletionsResponseJson: ',
          openaiCompletionsResponseJson,
        );
        setOpenaiCompletionsData(openaiCompletionsResponseJson);

        const openaiServiceFunctionsResponse = await fetch(
          SERVER_BASE_URL +
            CONTROLLER_SERVICE_OPENAI_ID +
            '/' +
            CONTROLLER_SERVICE_OPENAI_GET_FUNCTIONS,
        );
        if (!openaiServiceFunctionsResponse.ok) {
          throw new Error(
            'Network response was not ok ' +
              openaiServiceFunctionsResponse.statusText,
          );
        }
        const openaiServiceFunctionsResponseJson =
          await openaiServiceFunctionsResponse.json();
        console.log(
          'TaskManager openaiServiceFunctionsResponseJson: ',
          openaiServiceFunctionsResponseJson,
        );

        setOpenaiServiceFunctions(openaiServiceFunctionsResponseJson);
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

  // Callback function for ProcessView to update sharedData
  const handleProcessDataUpdate = (updatedProcessData) => {
    // setProcessData(updatedProcessData);
    setProcessData([...updatedProcessData]);
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
      {processData && (
        <ProcessView
          processData={processData}
          onProcessDataUpdate={handleProcessDataUpdate}
        />
      )}
      {processData && taskData && (
        <TaskView
          processData={processData} //pids={pids}
          taskData={taskData}
        />
      )}
      {openaiCompletionsData && taskData && openaiServiceFunctionsData && (
        <OpenaiCompletionsView
          openaiCompletionsData={openaiCompletionsData}
          taskData={taskData}
          openaiServiceFunctionsData={openaiServiceFunctionsData}
        />
      )}
    </div>
  );
}

export default TaskManager;
