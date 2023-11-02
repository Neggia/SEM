import React, { useState, useRef } from 'react';
import ReactDOM from 'react-dom';
// import { render } from 'react-dom';
import 'react-tabulator/lib/styles.css'; // import Tabulator styles
import 'tabulator-tables/dist/css/tabulator.min.css'; // import Tabulator stylesheet
import { ReactTabulator } from 'react-tabulator';
// import GroupHeader from './GroupHeader';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faPause, faStop } from '@fortawesome/free-solid-svg-icons';

// import { icon } from '@fortawesome/fontawesome-svg-core/import.macro';

// icon({ name: 'play', family: 'classic', style: 'solid' });
// icon({ name: 'pause', family: 'classic', style: 'solid' });
// icon({ name: 'stop', family: 'classic', style: 'solid' });

const PlayIcon = () => <FontAwesomeIcon icon={faPlay} />;
const PauseIcon = () => <FontAwesomeIcon icon={faPause} />;
const StopIcon = () => <FontAwesomeIcon icon={faStop} />;

const ProcessView = () => {
  let tableRef = useRef(null);

  // const allowedIds = [1, 2]; // Define your set of allowed values here

  const buttonFormatter = (cell) => {
    const cellElement = document.createElement('div');

    const handlePlay = () => {
      console.log('Play clicked for row:', cell.getRow().getData());
    };

    const handlePause = () => {
      console.log('Pause clicked for row:', cell.getRow().getData());
    };

    const handleStop = () => {
      console.log('Stop clicked for row:', cell.getRow().getData());
    };

    ReactDOM.render(
      <>
        <button onClick={handlePlay}>
          <PlayIcon />
        </button>
        <button onClick={handlePause}>
          <PauseIcon />
        </button>
        <button onClick={handleStop}>
          <StopIcon />
        </button>
      </>,
      cellElement,
    );

    return cellElement;
  };

  const [data, setData] = useState([
    {
      id: 1,
      name: 'process1',
      server: 'server1',
      interval: 24,
      last_run: 0,
      last_duration: 0,
      progress: 100,
    },
    {
      id: 2,
      name: 'process2',
      server: 'server2',
      interval: 48,
      last_run: 0,
      last_duration: 0,
      progress: 50,
    },
  ]);
  const [lastId, setLastId] = useState(data[data.length - 1].id);

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
          server1: 'Server 1',
          server2: 'Server 2',
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
    { title: 'Last run', field: 'last_run', width: 110 },
    { title: 'Last duration', field: 'last_duration', width: 130 },
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
      title: 'Actions',
      formatter: buttonFormatter,
      width: 100,
      hozAlign: 'center',
    },
  ];

  const options = {
    layout: 'fitData',
    // height: 150,
    // movableRows: true,
    selectable: 1, // make rows selectable
  };

  const addRow = () => {
    const newRow = {
      id: lastId + 1, // use the state variable here
      name: '',
      server: '',
      interval: 60,
      last_run: 0,
      last_duration: 0,
      progress: 0,
    };
    setData([...data, newRow]);
    setLastId(lastId + 1);
  };

  const deleteRow = () => {
    if (tableRef.current) {
      const selectedData = tableRef.current.getSelectedData();
      if (selectedData.length > 0) {
        const newData = data.filter((row) => row.id !== selectedData[0].id);
        setData(newData);
        setLastId(lastId - 1);
      } else {
        alert('Please select a row to delete');
      }
    }
  };

  return (
    <div>
      <button onClick={addRow}>Add new process</button>
      <button onClick={deleteRow}>Delete process</button>
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
