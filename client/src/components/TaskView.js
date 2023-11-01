import React, { useContext, useState, useEffect, useRef } from 'react';
import {
  createColumn,
  RowType,
  NodeKeys,
  FooterOperation,
  ColumnWidthMode,
  LockMode,
  FilterOperation,
  //   createTextInputFilterOptions,
} from '@ezgrid/grid-core';
import {
  ReactDataGrid,
  createTextInputFilterOptions,
} from '@ezgrid/grid-react';
import '@ezgrid/grid-core/styles.css';
import '@ezgrid/grid-core/icons.css';

const TaskView = () => {
  const columns = [
    {
      // ...createColumn("employeeName", "string", "Name"),
      ...createColumn('pid', 'number', 'Process ID'),
      enableHierarchy: true,
    },
    createColumn('interval', 'number', 'Interval'),
    // createColumn("title", "string", "Title"),
    // createColumn('hireDate', 'string', 'Hire Date'),
  ];
  const nestedColumns = [
    {
      //   ...createColumn('project', 'string', 'Project'),
      ...createColumn('website_name', 'string', 'Website'),
      enableHierarchy: true,
    },
    // createColumn('roleOnProject', 'string', 'Role'),
    // createColumn('comments', 'string', 'Comments'),
    createColumn('url', 'string', 'Url'),
    createColumn('lastrun', 'number', 'Last run'),
    createColumn('lastpage', 'number', 'Last page'),
  ];
  //   const nestedNestedColumns = [
  //     createColumn('hours', 'number', 'Hours'),
  //     createColumn('rate', 'currency', 'Rate'),
  //     createColumn('totalExpense', 'currency', 'Total Expense'),
  //   ];
  return (
    <ReactDataGrid
      style={{ height: '600px', width: '100%' }}
      gridOptions={{
        //SampleData.sampleNestedData,
        dataProvider: [
          {
            pid: 1,
            interval: 3600,
            websites: [
              {
                pid: 1,
                website_id: 1,
                website_name: 'Pagine azzurre 1',
                url: 'https://www.pagineazzurre1.net',
                lastrun: null,
                lastpage: null,
              },
              {
                pid: 1,
                website_id: 2,
                website_name: 'Pagine azzurre 2',
                url: 'https://www.pagineazzurre2.net',
                lastrun: null,
                lastpage: null,
              },
            ],
          },
          {
            pid: 2,
            interval: 7200,
            websites: [
              {
                pid: 2,
                website_id: 3,
                website_name: 'Pagine azzurre 3',
                url: 'https://www.pagineazzurre3.net',
                lastrun: null,
                lastpage: null,
              },
            ],
          },
        ],
        uniqueIdentifierOptions: {
          useField: 'website_id',
        },
        columns,
        eventBus: {
          onApiContextReady: (ctx) => {
            ctx.api.expandAll();
          },
          onCellClicked: (cell) => {
            console.log(cell);
          },
        },
        nextLevel: {
          childrenField: 'websites',
          columns: nestedColumns,
          //   nextLevel: {
          //     childrenField: 'items',
          //     columns: nestedNestedColumns,
          //   },
        },
      }}
    />
  );

  /*   return (
    <ReactDataGrid
      style={{ height: '300px', width: '100%' }}
      gridOptions={{
        dataProvider: [
          {
            pid: 1,
            website_id: 1,
            website_name: 'Pagine azzurre 1',
            url: 'https://www.pagineazzurre1.net',
            lastrun: null,
            lastpage: null,
          },
          {
            pid: 1,
            website_id: 2,
            website_name: 'Pagine azzurre 2',
            url: 'https://www.pagineazzurre2.net',
            lastrun: null,
            lastpage: null,
          },
          {
            pid: 2,
            website_id: 3,
            website_name: 'Pagine azzurre 3',
            url: 'https://www.pagineazzurre3.net',
            lastrun: null,
            lastpage: null,
          },
        ],
        uniqueIdentifierOptions: {
          useField: 'website_id',
        },
        columns: [
          createColumn('pid', 'number', 'Process ID'),
          createColumn('website_name', 'string', 'Website'),
          createColumn('url', 'string', 'Url'),
          createColumn('lastrun', 'number', 'Last run'),
          createColumn('lastpage', 'number', 'Last page'),
        ],
        nextLevel: {
          childrenField: 'deals',
          columns: [
            {
              ...createColumn('id'),
              headerText: 'Deal ID',
              uniqueIdentifier: 'DealID',
              enableHierarchy: true,
              //   widthMode: ColumnWidthMode.Fixed,
              width: 200,
              //   lockMode: LockMode.Left,
            },
            {
              ...createColumn('dealDescription'),
              headerText: 'Description',
              //   widthMode: ColumnWidthMode.Fixed,
              width: 300,
            },
          ],
        },
      }}
    ></ReactDataGrid>
  ); */
};

export default TaskView;
