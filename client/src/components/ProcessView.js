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
import {
  SERVER_BASE_URL,
  CONTROLLER_PROCESS_ID,
  CONTROLLER_PROCESS_SYNC,
  PROCESS_STATUS_RUNNING,
  PROCESS_STATUS_PAUSED,
  PROCESS_STATUS_STOPPED,
  PROCESS_STATUS_ERROR,
  CLASS_ICON_BUTTON_PRESSED,
  CLASS_ICON_BUTTON_NOT_PRESSED,
  displayFlashMessage,
} from '../utils/globals';
// import { DateTime } from 'luxon';

// import { icon } from '@fortawesome/fontawesome-svg-core/import.macro';

// icon({ name: 'play', family: 'classic', style: 'solid' });
// icon({ name: 'pause', family: 'classic', style: 'solid' });
// icon({ name: 'stop', family: 'classic', style: 'solid' });

const PlayIcon = () => <FontAwesomeIcon icon={faPlay} />;
const PauseIcon = () => <FontAwesomeIcon icon={faPause} />;
const StopIcon = () => <FontAwesomeIcon icon={faStop} />;
const SaveIcon = () => <FontAwesomeIcon icon={faFloppyDisk} />;

const ProcessView = ({ processData, onProcessDataUpdate }) => {
  const [data, setData] = useState(processData);
  const [lastId, setLastId] = useState(data[data.length - 1].id);
  const [deletedIds, setDeletedIds] = useState([]);

  let tableRef = useRef(null);

  useEffect(() => {
    if (processData) {
      setData(processData);
      setLastId(data[data.length - 1].id);
    }
  }, [processData]);

  const buttonFormatter = (cell) => {
    const cellElement = document.createElement('div');
    const rowData = cell.getRow().getData();

    // const handlePlay = () => {
    //   console.log('Play clicked for row:', cell.getRow().getData());
    //   rowData.status = PROCESS_STATUS_RUNNING;
    //   // Update the state with the modified data
    //   setData((prevData) => {
    //     return prevData.map((item) =>
    //       item.id === rowData.id ? { ...item, ...rowData } : item,
    //     );
    //   });
    // };

    const handlePause = () => {
      console.log('Pause clicked for row:', rowData);

      rowData.status = PROCESS_STATUS_PAUSED;
      // Update the state with the modified data
      setData((prevData) => {
        return prevData.map((item) =>
          item.id === rowData.id ? { ...item, ...rowData } : item,
        );
      });
    };

    const handleStop = () => {
      // const rowData = cell.getRow().getData();
      console.log('Stop clicked for row:', rowData);

      // rowData.interval = 0;
      rowData.duration = ''; //'00:00:00:000';
      rowData.last_end = 0;
      rowData.last_start = 0;
      rowData.last_start_datetime = ''; //'1970-01-01 01:00:00';
      rowData.status = PROCESS_STATUS_STOPPED;
      rowData.message = '';
      // Update the state with the modified data
      setData((prevData) => {
        return prevData.map((item) =>
          item.id === rowData.id ? { ...item, ...rowData } : item,
        );
      });
      // console.log('data: ', data);
      // cell.getRow().update();
      // setData(data);

      // Refresh the table
      // if (tableRef.current) {
      //   tableRef.current.table.redraw(true);
      // }
    };

    const root = createRoot(cellElement); // Create a root.

    root.render(
      <>
        <button
          disabled
          // onClick={handlePlay}
          className={
            rowData.status & PROCESS_STATUS_RUNNING
              ? CLASS_ICON_BUTTON_PRESSED
              : CLASS_ICON_BUTTON_NOT_PRESSED
          }
        >
          <PlayIcon />
        </button>
        <button
          onClick={handlePause}
          className={
            rowData.status & PROCESS_STATUS_PAUSED
              ? CLASS_ICON_BUTTON_PRESSED
              : CLASS_ICON_BUTTON_NOT_PRESSED
          }
        >
          <PauseIcon />
        </button>
        <button
          onClick={handleStop}
          className={
            rowData.status & PROCESS_STATUS_STOPPED
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
    { title: 'Process ID', field: 'id', width: 110 },
    // { title: 'Website', field: 'website_name', width: 150 },
    {
      title: 'Name',
      field: 'name',
      width: 110,
      editor: 'input',
      headerFilter: 'input',
    },
    {
      title: 'Server',
      field: 'server',
      width: 110,
      editor: 'list',
      editorParams: {
        values: {
          localhost: 'server 1',
          // server2: 'Server 2',
        },
      },
      // headerFilter: 'input',
    },
    {
      title: 'Interval (h)',
      field: 'interval',
      width: 110,
      editor: 'number',
      editorParams: {
        min: 1,
        max: 168, // 1 week
        step: 1,
        elementAttributes: {
          maxlength: '10', //set the maximum character length of the input element to 10 characters
        },
        mask: '999',
        selectContents: true,
        verticalNavigation: 'editor', //up and down arrow keys navigate away from cell without changing value
      },
      // headerFilter: 'input',
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
    { title: 'Duration', field: 'duration', width: 110 },
    { title: 'Message', field: 'message', width: 350 },
  ];

  const options = {
    layout: 'fitData',
    // height: 150,
    // movableRows: true,
    selectable: 1, // make rows selectable
  };

  const addRow = () => {
    const newId = lastId + 1;

    const newRow = {
      id: newId,
      name: 'process' + newId,
      server: 'localhost',
      interval: 24,
      last_start: 0,
      last_end: 0,
      progress: 0,
      status: PROCESS_STATUS_STOPPED,
      message: '',
    };
    setData([...data, newRow]);
    onProcessDataUpdate([...data, newRow]);
    setLastId(lastId + 1);
  };

  const deleteRow = () => {
    if (tableRef.current) {
      const selectedData = tableRef.current.getSelectedData();
      if (selectedData.length > 0) {
        const newData = data.filter((row) => row.id !== selectedData[0].id);
        setData(newData);
        onProcessDataUpdate(newData);
        setLastId(lastId - 1);
        setDeletedIds([...deletedIds, selectedData[0].id]);
      } else {
        alert('Please select a row to delete');
      }
    }
  };

  const flashMessageDivId = 'process-flash-message';

  const handleSave = async () => {
    console.log('data: ', data);
    console.log('deletedIds: ', deletedIds);

    const processDto = {
      saveObjects: data,
      deleteIds: deletedIds,
    };
    const response = await axios
      .post(
        SERVER_BASE_URL + CONTROLLER_PROCESS_ID + CONTROLLER_PROCESS_SYNC,
        processDto,
      )
      .then((response) => {
        // Handle success
        console.log('Success:', response.data);
        // Optionally, display a success message
        displayFlashMessage('Process data saved', 'success', flashMessageDivId);
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

  return (
    <div>
      <div class="buttons-and-message-container">
        <button onClick={addRow}>Add new process</button>
        <button onClick={deleteRow}>Delete process</button>
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

export default ProcessView;
