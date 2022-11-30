import * as React from 'react'
import MLString, { IMLString } from 'mlstring'
import './multidate.css'

const strEst = new MLString({ default: 'Est', values: new Map([['ru', 'Ожид']]) })
const strBL = new MLString({ default: 'Baseline', values: new Map([['ru', 'ПоПлану']]) })
const strFact = new MLString({ default: 'Factual', values: new Map([['ru', 'Факт']]) })
const strBLShort = new MLString({ default: 'BL', values: new Map([['ru', 'БП']]) })
type MultiDateStyle = 'full' | 'brief' | 'superbrief'

export interface IDateRange {
  datepoint: Date
  tolerance?: {
    left?: number
    right?: number
  }
}

interface IMultiDateExterior {
  style: MultiDateStyle //full, brief, superbrief
  current?: string
  showTolerance: boolean
  showTime: boolean
}

export const MULTIDATE_EXTERIOR_SUPERBRIEF: IMultiDateExterior = {
  style: 'superbrief',
  showTolerance: false,
  showTime: false,
}

export const MULTIDATE_EXTERIOR_BRIEF: IMultiDateExterior = {
  style: 'brief',
  showTolerance: true,
  showTime: false,
}

export const MULTIDATE_EXTERIOR_FULL: IMultiDateExterior = {
  style: 'full',
  showTolerance: true,
  showTime: true,
}
export interface IMultiDate {
  title: string | IMLString
  subtitle?: string | IMLString
  estimated: IDateRange
  baseline?: Map<string, IDateRange>
  factual?: IDateRange
  state?: IMultiDateExterior
}

class DateRange implements IDateRange {
  public datepoint: Date
  public tolerance?: { left?: number; right?: number }
  constructor(d: IDateRange) {
    this.datepoint = new Date(d.datepoint)
    this.tolerance = d.tolerance
  }
}

class MultiDate extends React.Component<IMultiDate, IMultiDateExterior> {
  constructor(props: IMultiDate) {
    super(props)
    if (props.state) {
      this.state = props.state
    } else {
      this.state = MULTIDATE_EXTERIOR_SUPERBRIEF
    }
  }
  getDateToView(): DateRange {
    const cur = this.state.current ? this.state.current : strEst.toString()
    const ret = this.getDates().get(cur)
    return ret ? ret : this.props.estimated
  }
  getDateTimeString(d?: DateRange): string {
    if (!d) d = this.getDateToView()
    return this.state.showTime ? d.datepoint.toLocaleString() : d.datepoint.toLocaleDateString()
  }
  getToleranceString(d?: DateRange): string {
    if (!d) d = this.getDateToView()
    return this.state.showTolerance && d.tolerance ? '+' + d.tolerance?.right + ';-' + d.tolerance?.left : ''
  }
  getDates(): Map<string, DateRange> {
    const ret = new Map<string, DateRange>()
    ret.set(strEst.toString(), new DateRange(this.props.estimated))
    if (this.props.factual) ret.set(strFact.toString(), new DateRange(this.props.factual))
    if (this.props.baseline) {
      const bls = new Map<string, DateRange>(this.props.baseline)
      bls.forEach((v, k) => ret.set(`${strBLShort.toString()}#${k}`, new DateRange(v)))
    }
    return ret
  }
  switchDate(index?: string) {
    if (!index) return
    const s: any = {}
    Object.assign(s, this.state)
    s.current = index
    this.setState(s)
  }
  render() {
    const s = this.state
    switch (s.style) {
      case 'superbrief':
        return (
          <span data-testid='md1' className={'multidate-container-' + s.style}>
            <div className='multidate-dateselected'>
              {this.getDateTimeString()}
              <span className='multidate-tolerance'>{this.getToleranceString()}</span>
            </div>
          </span>
        )
      case 'brief':
      default: {
        const cur = this.state.current ? this.state.current : strEst.toString()
        const dd = this.getDates()
        const keys = Array.from(dd.keys())
        const ind = keys.findIndex((v) => v === cur)
        let prevInd: string | undefined = undefined
        let nextInd: string | undefined = undefined
        if (ind) prevInd = keys[ind - 1]
        if (ind + 1 < keys.length) nextInd = keys[ind + 1]
        return (
          <div className={'multidate-container-' + s.style}>
            <div className='multidate-title'>
              {new MLString(this.props.title).toString()}
              <span className='multidate-expandinfo'>↕</span>
            </div>
            <div className='multidate-dateselected'>
              {this.getDateTimeString()}
              <span className='multidate-tolerance'>{this.getToleranceString()}</span>
            </div>
            <div className='multidate-dateselector'>
              <span className='multidate-dateselector-prev' onClick={() => this.switchDate(prevInd)}>
                {prevInd}
              </span>
              <span className='multidate-dateselector-cur'>{cur}</span>
              <span className='multidate-dateselector-next' onClick={() => this.switchDate(nextInd)}>
                {nextInd}
              </span>
            </div>
          </div>
        )
      }
    }
  }
}
export default MultiDate
