import MLString from 'mlstring';
import React from 'react';
import ReactDOM from 'react-dom/client';
import MultiDate, { IMultiDate, MULTIDATE_EXTERIOR_SUPERBRIEF, MULTIDATE_EXTERIOR_FULL, MULTIDATE_EXTERIOR_BRIEF } from './components/multidate.tsx';
import './index.css'

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
const tmd: IMultiDate = {
  title: {
    default: 'Multidate data',
    values: new Map<string, string>([
      ['de', ''],
      ['fr', ''],
      ['es', ''],
      ['uk', ''],
      ['ru', 'Дата для планирования']
    ])
  },
  subtitle: {
    default: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
    values: new Map<string, string>([
      ['de', ''],
      ['fr', ''],
      ['es', ''],
      ['uk', ''],
      ['ru', 'Lorem ipsum — классический текст-«рыба». Является искажённым отрывком из философского трактата Марка Туллия Цицерона «О пределах добра и зла», написанного в 45 году до н. э. на латинском языке, обнаружение сходства приписывается Ричарду Макклинтоку.']
    ])
  },

  estimated: {
    datepoint: new Date('2022-07-11T05:00:00.000+00:00'),
    tolerance: {
      left: 10,
      right: 0,
    },
  },
  baseline: new Map([
    [
      '🎯',
      {
        datepoint: new Date('2022-10-11T05:00:00.000+00:00'),
        tolerance: {
          left: 0,
          right: 5,
        },
      },
    ],
    [
      'YTDQ1',
      {
        datepoint: new Date('2023-01-11T05:00:00.000+00:00'),
        tolerance: {
          left: 1,
          right: 1,
        },
      },
    ],
    [
      'YTDQ2',
      {
        datepoint: new Date('2023-04-11T05:00:00.000+00:00'),
        tolerance: {
          left: 2,
          right: 2,
        },
      },
    ],
    [
      'YTDQ3',
      {
        datepoint: new Date('2023-07-11T05:00:00.000+00:00'),
        tolerance: {
          left: 3,
          right: 3,
        },
      },
    ],
  ]),
};

root.render(
  <React.StrictMode>
    <div style={{display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '2px'}}>
      <span>Super-Brief exterior&nbsp;</span>
      <MultiDate title={tmd.title}
        subtitle={tmd.subtitle} 
        estimated={tmd.estimated} 
        baseline={tmd.baseline}
        state={MULTIDATE_EXTERIOR_SUPERBRIEF} />
      <span>Brief exterior&nbsp;</span>
      <MultiDate title={tmd.title}
        subtitle={tmd.subtitle} 
        estimated={tmd.estimated} 
        baseline={tmd.baseline}
        state={MULTIDATE_EXTERIOR_BRIEF} />
      <span>Full exterior&nbsp;</span>
      <MultiDate title={tmd.title}
        subtitle={tmd.subtitle} 
        estimated={tmd.estimated} 
        baseline={tmd.baseline}
        state={MULTIDATE_EXTERIOR_FULL} />
    </div>
  </React.StrictMode>,
)