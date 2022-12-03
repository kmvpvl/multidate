import React from 'react';
import ReactDOM from 'react-dom/client';
import MultiDate from 'scheduling-multidate';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
const tmd = {
  title: 'TEST',
  estimated: {
    datepoint: new Date('2022-07-11T05:00:00.000+00:00'),
    tolerance: {
      left: 10,
      right: 0,
    },
  },
  baseline: new Map([
    [
      '0',
      {
        datepoint: new Date('2022-07-11T05:00:00.000+00:00'),
        tolerance: {
          left: 1,
          right: 5,
        },
      },
    ],
    [
      'YTDQ3',
      {
        datepoint: new Date('2022-07-11T05:00:00.000+00:00'),
        tolerance: {
          left: 0,
          right: 0,
        },
      },
    ],
  ]),
};

let tmd1:any;
//Object.assign(tmd1, tmd);
//tmd1.
root.render(
  <React.StrictMode>
    Brief exterior
    <MultiDate title={"BRIEF"} 
      estimated={tmd.estimated} 
      baseline={tmd.baseline}
      state={{style:"brief", showTolerance:false, showTime:false}} />
  </React.StrictMode>,
)