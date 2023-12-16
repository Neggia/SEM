import React, { useState, useRef, useEffect } from 'react';
// import ReactDOM from 'react-dom';
import { createRoot } from 'react-dom/client';
// import { render } from 'react-dom';
import 'react-tabulator/lib/styles.css'; // import Tabulator styles
import 'tabulator-tables/dist/css/tabulator.min.css'; // import Tabulator stylesheet
import { ReactTabulator } from 'react-tabulator';
// import GroupHeader from './GroupHeader';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPlay,
  faPause,
  faStop,
  faFloppyDisk,
  faSync,
} from '@fortawesome/free-solid-svg-icons';

// import { icon } from '@fortawesome/fontawesome-svg-core/import.macro';

// icon({ name: 'play', family: 'classic', style: 'solid' });
// icon({ name: 'pause', family: 'classic', style: 'solid' });
// icon({ name: 'stop', family: 'classic', style: 'solid' });

const PlayIcon = () => <FontAwesomeIcon icon={faPlay} />;
const PauseIcon = () => <FontAwesomeIcon icon={faPause} />;
const StopIcon = () => <FontAwesomeIcon icon={faStop} />;
const SaveIcon = () => <FontAwesomeIcon icon={faFloppyDisk} />;
const UpdateIcon = () => <FontAwesomeIcon icon={faSync} />;

const OpenaiCompletionsView = ({
  openaiCompletionsData,
  taskData,
  openaiServiceFunctionsData,
}) => {
  const [data, setData] = useState(openaiCompletionsData);
  const [tasks, setTasks] = useState(null);
  const [currentTask, setCurrentTask] = useState(null);
  const [openaiServiceFunctions, setOpenaiServiceFunctions] = useState(null);
  const [currentOpenaiServiceFunction, setCurrentOpenaiServiceFunction] =
    useState(null);

  useEffect(() => {
    if (openaiCompletionsData) {
      setData(openaiCompletionsData);

      let tasksArray = [];
      for (const task of taskData) {
        tasksArray.push(task.name);
      }
      setTasks(tasksArray);
      setCurrentTask(tasksArray[0]);

      setOpenaiServiceFunctions(openaiServiceFunctionsData);
      setCurrentOpenaiServiceFunction(openaiServiceFunctionsData[0]);
    }
  }, [taskData, openaiServiceFunctionsData]);

  let tableRef = useRef(null);

  const buttonFormatter = (cell) => {
    const cellElement = document.createElement('div');

    // const handlePlay = () => {
    //   console.log('Play clicked for row:', cell.getRow().getData());
    // };

    const handleUpdate = () => {
      console.log('Update clicked for row:', cell.getRow().getData());
    };

    // const handlePause = () => {
    //   console.log('Pause clicked for row:', cell.getRow().getData());
    // };

    // const handleStop = () => {
    //   console.log('Stop clicked for row:', cell.getRow().getData());
    // };

    const root = createRoot(cellElement); // Create a root.

    root.render(
      <>
        {/* <button onClick={handlePlay}>
          <PlayIcon />
        </button> */}
        <button onClick={handleUpdate}>
          <UpdateIcon />
        </button>
        {/* <button onClick={handlePause}>
          <PauseIcon />
        </button>
        <button onClick={handleStop}>
          <StopIcon />
        </button> */}
      </>,
    );

    return cellElement;
  };

  const columns = [
    // { title: 'Function', field: 'function_name', width: 110 },
    {
      title: 'Website',
      field: 'website_id',
      width: 150,
      // editor: 'input',
      // headerFilter: 'input',
    },
    // {
    //   title: 'Openai prompt',
    //   field: 'body',
    //   width: 250,
    //   editor: 'input',
    //   headerFilter: 'input',
    //   formatter: 'link',
    // },
    {
      title: 'Openai prompt',
      field: 'body',
      editor: 'textarea',
      width: 500,
      editorParams: {
        elementAttributes: {
          maxlength: '10000', //set the maximum character length of the textarea element
        },
        // mask: 'AAA-999',
        selectContents: true,
        verticalNavigation: 'editor', //navigate cursor around text area without leaving the cell
        shiftEnterSubmit: true, //submit cell value on shift enter
      },
    },
    // {
    //   title: 'Progress',
    //   field: 'progress',
    //   width: 110,
    //   formatter: 'progress',
    //   formatterParams: {
    //     min: 0,
    //     max: 100,
    //     color: ['red', 'orange', 'green'],
    //     legendColor: '#000000',
    //     legendAlign: 'center',
    //   },
    // },
    {
      title: 'Update',
      formatter: buttonFormatter,
      width: 90,
      hozAlign: 'center',
    },
    // { title: 'Last run', field: 'last_run', width: 110 },
  ];

  // const handleGroupHeaderPlay = () => {
  //   console.log('Play clicked for GroupHeader:');
  // };

  // const handleGroupHeaderPause = () => {
  //   console.log('Pause clicked for GroupHeader:');
  // };

  // const handleGroupHeaderStop = () => {
  //   console.log('Stop clicked for GroupHeader:');
  // };

  // const renderGroupHeaderButtons = (container) => {
  //   const buttons = (
  //     <div>
  //       <button onClick={handleGroupHeaderPlay}>
  //         <FontAwesomeIcon icon={faPlay} />
  //       </button>
  //       <button onClick={handleGroupHeaderPause}>
  //         <FontAwesomeIcon icon={faPause} />
  //       </button>
  //       <button onClick={handleGroupHeaderStop}>
  //         <FontAwesomeIcon icon={faStop} />
  //       </button>
  //     </div>
  //   );

  //   ReactDOM.createPortal(buttons, container);
  // };

  // const renderGroupHeaderButtons = () => (
  //   <div>
  //     <button onClick={() => console.log('Play')}>
  //       <FontAwesomeIcon icon={faPlay} />
  //     </button>
  //     <button onClick={() => console.log('Pause')}>
  //       <FontAwesomeIcon icon={faPause} />
  //     </button>
  //     <button onClick={() => console.log('Stop')}>
  //       <FontAwesomeIcon icon={faStop} />
  //     </button>
  //   </div>
  // );

  const options = {
    layout: 'fitData',
    // height: 150,
    // movableRows: true,
    selectable: 1, // make rows selectable
    groupBy: 'function_name',
    groupHeader: function (value, count, data, group) {
      // value - the value all members of this group share for the grouping property
      // count - the number of rows in this group
      // data - an array of all the row data objects in this group
      // group - the group component for the group

      // const container = document.createElement('div');
      // renderGroupHeaderButtons(container);
      // return container;

      /*       const playButton =
        // '<button onClick={() => console.log("Play")}>Play</button>';
        "<button onClick={handleGroupHeaderPlay}><i className='fas fa-play'></i>Play</button>";
      // '<button onClick={handleClick}><i className="fa-solid fa-play"></i> Play</button>';
      const pauseButton =
        "<button onclick='handleGroupHeaderPause()'><i className='fas fa-pause'></i>Pause</button>";
      const stopButton =
        "<button onclick='handleGroupHeaderStop()'><i className='fas fa-stop'></i>Stop</button>"; */

      return value;
      // +
      // value +
      // "<span style='color:#d00; margin-left:10px;'>( runs every " +
      // value * 60 +
      // ' minutes on server x )</span>'
      // // playButton +
      // // pauseButton +
      // // stopButton
    },
    // groupHeader: (value, count, data, group) => {
    //   const container = document.createElement('div');
    //   render(
    //     <GroupHeader
    //       value={value}
    //       playAction={handleGroupHeaderPlay}
    //       pauseAction={handleGroupHeaderPause}
    //       stopAction={handleGroupHeaderStop}
    //     />,
    //     container,
    //   );
    //   return container;
    // },
  };

  const addRow = () => {
    const newRow = {
      id: 0,
      function_name: currentOpenaiServiceFunction,
      website_id: currentTask,
      group_id: null,
      body: '',
    };
    console.log('addRow() newRow: ', newRow);
    console.log('addRow() data: ', data);
    setData([...data, newRow]);
  };

  const deleteRow = () => {
    if (tableRef.current) {
      const selectedData = tableRef.current.getSelectedData();
      if (selectedData.length > 0) {
        const newData = data.filter(
          (row) => row.website_id !== selectedData[0].website_id,
        );
        setData(newData);
      } else {
        alert('Please select a row to delete');
      }
    }
  };

  const handleSave = () => {};

  if (tasks === null || openaiServiceFunctions === null) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div class="buttons-and-message-container">
        <button onClick={addRow}>Add new prompt </button>
        <select
          // value={currentPid}
          onChange={(e) => setCurrentOpenaiServiceFunction(e.target.value)}
        >
          <option value="" disabled>
            function
          </option>
          {openaiServiceFunctions.map((openaiServiceFunction) => (
            <option key={openaiServiceFunction} value={openaiServiceFunction}>
              {openaiServiceFunction}
            </option>
          ))}
        </select>
        for website id
        <select
          // value={currentPid}
          onChange={(e) => setCurrentTask(e.target.value)}
        >
          <option value="" disabled>
            website
          </option>
          {tasks.map((task) => (
            <option key={task.id} value={task}>
              {task}
            </option>
          ))}
        </select>
        <button onClick={deleteRow}>Delete prompt</button>
        <button onClick={handleSave}>
          <SaveIcon />
        </button>
      </div>
      <ReactTabulator
        // ref={tableRef}
        onRef={(ref) => (tableRef = ref)}
        columns={columns}
        data={data}
        options={options}
      />
    </div>
  );
};

export default OpenaiCompletionsView;
