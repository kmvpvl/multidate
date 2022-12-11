import * as React from 'react'
import MLString, { IMLString } from 'mlstring'
import './multidate.css'

const strEst = new MLString({ 
  default: 'Estimated', 
  values: new Map([
  ['de', 'Vermutet'],
  ['fr', 'Censé'],
  ['es', 'Supuesto'],
  ['uk', 'Очікуваний'],
  ['ru', 'Ожидаемая']
  ]) 
})
const strFact = new MLString({ 
  default: 'Factual', 
  values: new Map([
    ['de', 'Tatsächliches'],
    ['fr', 'Factuelle'],
    ['es', 'Fecha real'],
    ['uk', 'Фактична'],
    ['ru', 'Факт']
  ]) 
})

const strBLShort = new MLString({ 
  default: 'BL',
  values: new Map<string, string>([
    ['de', 'GL'],
    ['fr', 'LdB'],
    ['es', 'LdB'],
    ['uk', 'БП'],
    ['ru', 'БП']
  ])
})
const strBaselines = new MLString({
  default: 'Baselines',
  values: new Map<string, string>([
    ['de', 'Grundlinien'],
    ['fr', 'Lignes de base'],
    ['es', 'Líneas de base'],
    ['uk', 'Базові плани'],
    ['ru', 'Базовые планы']
  ])
})
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
  showMinDetailsButtons: boolean
}

export const MULTIDATE_EXTERIOR_SUPERBRIEF: IMultiDateExterior = {
  style: 'superbrief',
  showTolerance: false,
  showTime: false,
  showMinDetailsButtons: false
}

export const MULTIDATE_EXTERIOR_BRIEF: IMultiDateExterior = {
  style: 'brief',
  showTolerance: true,
  showTime: false,
  showMinDetailsButtons: false
}

export const MULTIDATE_EXTERIOR_FULL: IMultiDateExterior = {
  style: 'full',
  showTolerance: true,
  showTime: true,
  showMinDetailsButtons: false
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
  private minButton: React.RefObject<HTMLSpanElement>
  private detailButton: React.RefObject<HTMLSpanElement>

  constructor(props: IMultiDate) {
    super(props)
    this.minButton = React.createRef();
    this.detailButton = React.createRef();
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
  showMinDetails (show?: boolean) {
    if (show === undefined) show = !this.state.showMinDetailsButtons
    const s: any = {}
    Object.assign(s, this.state)
    s.showMinDetailsButtons = show;
    this.setState(s)
  }
  changeExteriorStyle(style: string) {
    const s: any = {}
    Object.assign(s, this.state)
    s.style = style;
    s.showMinDetailsButtons = false;
    this.setState(s)
  }
  toggleToleranceTime() {
    const s: any = {}
    Object.assign(s, this.state)
    if (!this.state.showTolerance) {
      s.showTolerance = true
    } else {
      if (this.state.showTime) {
        s.showTolerance = false;
        s.showTime = false;
      } else {
        s.showTime = true;
      }
    }
    this.setState(s)
  }
  render() {
    const s = this.state
    switch (s.style) {
      case 'superbrief':
        return (
          <span data-testid='md1' className={'multidate-container-' + s.style} 
            onTouchStart={() => this.showMinDetails(true)}
            onMouseEnter={() => this.showMinDetails(true)}
            onMouseLeave={() => this.showMinDetails(false)}>
            <span
            onDoubleClick={() => this.toggleToleranceTime()}
            >
              {this.getDateTimeString()}</span>
            <span className='multidate-tolerance'>{this.getToleranceString()}</span>
            {this.state.showMinDetailsButtons? <span ref={this.detailButton} className='multidate-details-button'
            onClick={() => this.changeExteriorStyle('brief')}
            ></span>:null}
          </span>
        )
      case 'brief':
        const cur = this.state.current ? this.state.current : strEst.toString()
        const dd = this.getDates()
        const keys = Array.from(dd.keys())
        const ind = keys.findIndex((v) => v === cur)
        let prevInd: string | undefined = undefined
        let nextInd: string | undefined = undefined
        if (ind) prevInd = keys[ind - 1]
        if (ind + 1 < keys.length) nextInd = keys[ind + 1]
        return (
          <span className={'multidate-container-' + s.style}
            onTouchStart={() => this.showMinDetails(true)}
            onMouseEnter={() => this.showMinDetails(true)}
            onMouseLeave={() => this.showMinDetails(false)}>
          <span className='multidate-title'>
              {new MLString(this.props.title).toString()}
            </span>
            {this.state.showMinDetailsButtons?<span ref={this.detailButton} className='multidate-details-button'
            onClick={() => this.changeExteriorStyle('full')}
            ></span>:null}
            {this.state.showMinDetailsButtons?<span ref={this.minButton} className="multidate-min-button"
            onClick={() => this.changeExteriorStyle('superbrief')}
            ></span>:null}
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
          </span>
        )
      case 'full':
        return (
          <span className={'multidate-container-' + s.style}
            onTouchStart={() => this.showMinDetails(true)}
            onMouseEnter={() => this.showMinDetails(true)}
            onMouseLeave={() => this.showMinDetails(false)}>
            <span className='multidate-title'>
                {new MLString(this.props.title).toString()}
            </span>
            {this.state.showMinDetailsButtons?<span ref={this.minButton} className="multidate-min-button"
            onClick={() => this.changeExteriorStyle('brief')}
            ></span>:null}
          {this.props.subtitle?<span className='multidate-subtitle'>{new MLString(this.props.subtitle).toString()}</span>:null}
          <span className='multidate-full-dates'>
            <span className=''>{strEst.toString()}</span>
            <span>{this.getDateTimeString(this.props.estimated)}<span className='multidate-tolerance'>{this.getToleranceString(this.props.estimated)}</span></span>
          {this.props.factual?
            (<><span className=''>{strEst.toString()}</span><span>{this.getDateTimeString(this.props.factual)}</span></>):null}
            <span>{strBaselines.toString()}</span><span></span>
            {this.props.baseline?Array.from(this.props.baseline.keys()).map (
              (v, k) => <React.Fragment key={k}><span className='multidate-full-date-caption'>{v}</span><span>{this.getDateTimeString(this.props.baseline?this.props.baseline.get(v):undefined)}<span className='multidate-tolerance'>{this.getToleranceString(this.props.baseline?this.props.baseline.get(v):undefined)}</span></span></React.Fragment>):null}
          </span>
        </span>
      )

      default: return (<span>Error: Unknown style</span>)
    }
  }
}
export default MultiDate
