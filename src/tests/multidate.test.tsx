import { render, cleanup, screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import * as React from 'react'
import MultiDate from '../multidate'

test('test MultiDate', () => {
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
  }

  render(<MultiDate {...tmd} />)
  const te = screen.getByTestId('md1')
  expect(te).toHaveTextContent('11/07/2022')
})
afterEach(cleanup)
