import React, { useState, useRef } from 'react';
import 'react-tabulator/lib/styles.css'; // import Tabulator styles
import 'tabulator-tables/dist/css/tabulator.min.css'; // import Tabulator stylesheet
import { ReactTabulator } from 'react-tabulator';

const TaskView = () => {
  const [data, setData] = useState([
    {
      pid: 1,
      website: 'Pagine azzurre 1',
      url: 'https://www.pagineazzurre1.net',
      lastrun: null,
      lastpage: null,
    },
    {
      pid: 1,
      website: 'Pagine azzurre 2',
      url: 'https://www.pagineazzurre2.net',
      lastrun: null,
      lastpage: null,
    },
    {
      pid: 2,
      website: 'Pagine azzurre 3',
      url: 'https://www.pagineazzurre3.net',
      lastrun: null,
      lastpage: null,
    },
    // ... more data
  ]);

  const columns = [
    { title: 'Process ID', field: 'pid', width: 110 },
    { title: 'Website', field: 'website', width: 150 },
    { title: 'Url', field: 'url', width: 250 },
    { title: 'Last run', field: 'lastrun', width: 110 },
    { title: 'Last page', field: 'lastpage', width: 110 },
    /*   {
    title: 'Age',
    field: 'age',
    hozAlign: 'left',
    formatter: 'number',
    width: 150,
  }, */
  ];

  const options = {
    // height: 150,
    movableRows: true,
    selectable: 1, // make rows selectable
    groupBy: 'pid',
    groupHeader: function (value, count, data, group) {
      // value - the value all members of this group share for the grouping property
      // count - the number of rows in this group
      // data - an array of all the row data objects in this group
      // group - the group component for the group

      return (
        'Process ID ' +
        value +
        "<span style='color:#d00; margin-left:10px;'>( runs every " +
        value * 60 +
        ' minutes )</span>'
      );
    },
  };

  const addRow = () => {
    const newRow = { id: data.length + 1, name: '', age: '', group: '' };
    setData([...data, newRow]);
  };

  const deleteRow = () => {
    if (tableRef.current) {
      const selectedData = tableRef.current.getSelectedData();
      if (selectedData.length > 0) {
        const newData = data.filter((row) => row.id !== selectedData[0].id);
        setData(newData);
      } else {
        alert('Please select a row to delete');
      }
    }
  };

  const tableRef = useRef(null);

  return (
    <div>
      <button onClick={addRow}>Add Row</button>
      <button onClick={deleteRow}>Delete Row</button>
      <ReactTabulator
        ref={tableRef}
        columns={columns}
        data={data}
        options={options}
      />
    </div>
  );
};

export default TaskView;
