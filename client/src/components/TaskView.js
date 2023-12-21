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
} from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import Swal from 'sweetalert2';
import {
  SERVER_BASE_URL,
  CONTROLLER_WEBSITE_ID,
  CONTROLLER_WEBSITE_SYNC,
  WEBSITE_STATUS_RUNNING,
  WEBSITE_STATUS_PAUSED,
  WEBSITE_STATUS_STOPPED,
  WEBSITE_STATUS_ERROR,
  CLASS_ICON_BUTTON_PRESSED,
  CLASS_ICON_BUTTON_NOT_PRESSED,
  displayFlashMessage,
} from '../utils/globals';

// import { icon } from '@fortawesome/fontawesome-svg-core/import.macro';

// icon({ name: 'play', family: 'classic', style: 'solid' });
// icon({ name: 'pause', family: 'classic', style: 'solid' });
// icon({ name: 'stop', family: 'classic', style: 'solid' });

const PlayIcon = () => <FontAwesomeIcon icon={faPlay} />;
const PauseIcon = () => <FontAwesomeIcon icon={faPause} />;
const StopIcon = () => <FontAwesomeIcon icon={faStop} />;
const SaveIcon = () => <FontAwesomeIcon icon={faFloppyDisk} />;

const TaskView = ({
  processData,
  taskData,
  //productStructureData
}) => {
  const [data, setData] = useState(taskData);
  // const [productStructures, setProductStructures] =
  //   useState(productStructureData);
  const [lastId, setLastId] = useState(null); //data[data.length - 1].id);
  const [pids, setPids] = useState(null);
  const [currentPid, setCurrentPid] = useState(null);
  const [deletedIds, setDeletedIds] = useState([]);
  // const [processData, setProcessData] = useState(data);

  useEffect(() => {
    if (taskData) {
      setData(taskData);
      if (data.length > 0) {
        setLastId(data[data.length - 1].id);
      }
      // setProductStructures(productStructureData);

      let pidsArray = [];
      for (const process of processData) {
        pidsArray.push(process.id);
      }
      setPids(pidsArray);
      setCurrentPid(pidsArray[0]);
    }
  }, [processData]);

  let tableRef = useRef(null);

  const buttonFormatter = (cell) => {
    const cellElement = document.createElement('div');
    const rowData = cell.getRow().getData();

    // const handlePlay = () => {
    //   console.log('Play clicked for row:', cell.getRow().getData());
    // };

    const handlePause = () => {
      console.log('Pause clicked for row:', rowData);

      rowData.status = WEBSITE_STATUS_PAUSED;
      // Update the state with the modified data
      setData((prevData) => {
        return prevData.map((item) =>
          item.id === rowData.id ? { ...item, ...rowData } : item,
        );
      });
    };

    const handleStop = () => {
      console.log('Stop clicked for row:', rowData);

      rowData.last_start = 0;
      rowData.last_start_datetime = ''; //'1970-01-01 01:00:00';
      rowData.num_pages = 0;
      rowData.last_page = 0;
      rowData.status = WEBSITE_STATUS_STOPPED;
      rowData.message = '';
      // Update the state with the modified data
      setData((prevData) => {
        return prevData.map((item) =>
          item.id === rowData.id ? { ...item, ...rowData } : item,
        );
      });
    };

    const root = createRoot(cellElement); // Create a root.

    root.render(
      <>
        <button
          disabled
          // onClick={handlePlay}
          className={
            rowData.status & WEBSITE_STATUS_RUNNING
              ? CLASS_ICON_BUTTON_PRESSED
              : CLASS_ICON_BUTTON_NOT_PRESSED
          }
        >
          <PlayIcon />
        </button>
        <button
          onClick={handlePause}
          className={
            rowData.status & WEBSITE_STATUS_PAUSED
              ? CLASS_ICON_BUTTON_PRESSED
              : CLASS_ICON_BUTTON_NOT_PRESSED
          }
        >
          <PauseIcon />
        </button>
        <button
          onClick={handleStop}
          className={
            rowData.status & WEBSITE_STATUS_STOPPED
              ? CLASS_ICON_BUTTON_PRESSED
              : CLASS_ICON_BUTTON_NOT_PRESSED
          }
        >
          <StopIcon />
        </button>
      </>,
    );

    return cellElement;
  };

  const columns = [
    { title: 'Task ID', field: 'id', width: 20 },
    {
      title: 'Website',
      field: 'name',
      width: 150,
      editor: 'input',
      headerFilter: 'input',
    },
    {
      title: 'Url',
      field: 'url',
      width: 250,
      editor: 'input',
      headerFilter: 'input',
      formatter: 'link',
    },
    {
      title: 'Status',
      formatter: buttonFormatter,
      width: 90,
      hozAlign: 'center',
    },
    {
      title: 'Progress',
      field: 'progress',
      width: 110,
      formatter: 'progress',
      formatterParams: {
        min: 0,
        max: 100,
        color: ['red', 'orange', 'green'],
        legendColor: '#000000',
        legendAlign: 'center',
      },
    },
    {
      title: 'Last start',
      field: 'last_start_datetime',
      width: 140,
      formatter: 'datetime',
      formatterParams: {
        // inputFormat: '',
        outputFormat: 'yyyy/MM/dd HH:mm:ss',
        invalidPlaceholder: '(invalid date)',
        timezone: 'Europe/Rome',
      },
    },
    {
      title: 'Product Structure',
      field: 'product_structure',
      editor: 'textarea',
      width: 350,
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
    {
      title: 'Pagination Structure',
      field: 'pagination_structure',
      editor: 'textarea',
      width: 350,
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
    { title: 'Message', field: 'message', width: 350, formatter: 'textarea' },
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
    movableRows: true,
    selectable: 1, // make rows selectable
    groupBy: 'pid',
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

      return 'Process ID ' + value;
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
    const newId = lastId + 1;

    const newRow = {
      id: newId,
      pid: currentPid, // use the state variable here
      // processId: currentPid,
      name: 'website' + newId,
      url: 'https://www.website' + newId + '.com',
      last_start: 0,
      last_start_datetime: '', //'1970-01-01 01:00:00';
      num_pages: 0,
      last_page: 0,
      status: WEBSITE_STATUS_STOPPED,
      progress: null,
      message: '',
    };
    setData([...data, newRow]);
    setLastId(lastId + 1);
  };

  const deleteRow = () => {
    if (tableRef.current) {
      const selectedData = tableRef.current.getSelectedData();
      if (selectedData.length > 0) {
        Swal.fire({
          title:
            'All website related records (html elements, structures, products) will be deleted also. Are you sure?',
          text: "You won't be able to revert this after you save tasks, but you can refresh page instead of saving to undo this action",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Yes, delete it!',
        }).then((result) => {
          if (result.isConfirmed) {
            const newData = data.filter((row) => row.id !== selectedData[0].id);
            setData(newData);
            setLastId(lastId - 1);
            setDeletedIds([...deletedIds, selectedData[0].id]);
          }
        });
      } else {
        alert('Please select a row to delete');
      }
    }
  };

  const flashMessageDivId = 'task-flash-message';

  const handleSave = async () => {
    console.log('data: ', data);
    console.log('deletedIds: ', deletedIds);

    const dataUpdated = data.map((object) => {
      object.message = '';
      return object;
    });
    console.log('dataUpdated: ', dataUpdated);
    setData(dataUpdated);

    const websiteDto = {
      saveObjects: data,
      // productStructures: productStructures,
      deleteIds: deletedIds,
    };
    const response = await axios
      .post(
        SERVER_BASE_URL + CONTROLLER_WEBSITE_ID + CONTROLLER_WEBSITE_SYNC,
        websiteDto,
      )
      .then((response) => {
        // Handle success
        console.log('Success:', response.data);
        // Optionally, display a success message
        displayFlashMessage('Task data saved', 'success', flashMessageDivId);
      })
      .catch((error) => {
        // Handle errors
        let errorMessage = 'An error occurred';
        if (
          error.response &&
          error.response.data &&
          error.response.data.message
        ) {
          errorMessage = error.response.data.message;
        }
        displayFlashMessage(errorMessage, 'error', flashMessageDivId);
      });
  };

  if (pids === null) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div class="buttons-and-message-container">
        <button onClick={addRow}>Add new task for process id</button>
        <select
          // value={currentPid}
          onChange={(e) => setCurrentPid(e.target.value)}
        >
          <option value="" disabled>
            pid
          </option>
          {pids.map((pid) => (
            <option key={pid} value={pid}>
              {pid}
            </option>
          ))}
        </select>
        <button onClick={deleteRow}>Delete task</button>
        <button onClick={handleSave}>
          <SaveIcon />
        </button>
        <div id={flashMessageDivId}></div>
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

export default TaskView;
