import React, { useState, useRef, useEffect } from 'react';
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

const TaskView = ({ taskData }) => {
  const [data, setData] = useState(taskData);
  // const [processData, setProcessData] = useState(data);

  useEffect(() => {
    if (taskData) {
      setData(taskData);
    }
  }, [taskData]);

  let tableRef = useRef(null);

  const allowedPids = [1, 2]; // Define your set of allowed values here

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

  const [pid, setPid] = useState(allowedPids[0]);
  /*   const [data, setData] = useState([
    {
      pid: 1,
      website_id: 1,
      website_name: 'Pagine azzurre 1',
      url: 'https://www.pagineazzurre1.net',
      last_run: null,
      progress: 90,
    },
    {
      pid: 1,
      website_id: 2,
      website_name: 'Pagine azzurre 2',
      url: 'https://www.pagineazzurre2.net',
      last_run: null,
      progress: 10,
    },
    {
      pid: 2,
      website_id: 3,
      website_name: 'Pagine azzurre 3',
      url: 'https://www.pagineazzurre3.net',
      last_run: null,
      progress: 50,
    },
    // ... more data
  ]); */

  const columns = [
    { title: 'Process ID', field: 'pid', width: 110 },
    // { title: 'Website', field: 'website_name', width: 150 },
    {
      title: 'Website',
      field: 'name',
      width: 150,
      editor: 'input',
      headerFilter: 'input',
    },
    // { title: 'Url', field: 'url', width: 250 },
    {
      title: 'Url',
      field: 'url',
      width: 250,
      editor: 'input',
      headerFilter: 'input',
      formatter: 'link',
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
    /*   {
    title: 'Age',
    field: 'age',
    hozAlign: 'left',
    formatter: 'number',
    width: 150,
  }, */
    {
      title: 'Actions',
      formatter: buttonFormatter,
      width: 100,
      hozAlign: 'center',
    },
    { title: 'Last run', field: 'last_run', width: 110 },
  ];

  const handleGroupHeaderPlay = () => {
    console.log('Play clicked for GroupHeader:');
  };

  const handleGroupHeaderPause = () => {
    console.log('Pause clicked for GroupHeader:');
  };

  const handleGroupHeaderStop = () => {
    console.log('Stop clicked for GroupHeader:');
  };

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

      return 'Process ID';
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
      pid: pid, // use the state variable here
      website_id: null,
      website_name: '',
      url: '',
      last_run: null,
      progress: null,
    };
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

  return (
    <div>
      <button onClick={addRow}>Add new task for process id</button>
      <select value={pid} onChange={(e) => setPid(e.target.value)}>
        <option value="" disabled>
          pid
        </option>
        {allowedPids.map((pid) => (
          <option key={pid} value={pid}>
            {pid}
          </option>
        ))}
      </select>
      <button onClick={deleteRow}>Delete task</button>
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
