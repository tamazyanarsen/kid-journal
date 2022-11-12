import {css, html, LitElement} from 'lit'
import {customElement, state, property, query} from 'lit/decorators.js'

const tagName = 'main-element';

export type SleepJournal = {
  [key:string]: {[key:string]:{start: string, end:string}};
}

const storageKey = 'sleep-journal';

const currentDateKey = getDate(new Date());

// const storage: SleepJournal = JSON.parse(localStorage.getItem(storageKey) || '{}');
const storage: SleepJournal = {};
localStorage.setItem(storageKey, JSON.stringify(storage));

/**
 * An example element.
 *
 * @slot - This element has a slot
 * @csspart button - The button
 */
@customElement(tagName)
export class Main extends LitElement {
  @state()
  count = 1;

  constructor() {
    super();
    console.log(getDate(new Date()))
  }

  connectedCallback() {
    super.connectedCallback();
    setTimeout(()=>{
      if(currentDateKey in storage) {
        if(this.startTime && this.endTime){
          this.startTime.value = storage[currentDateKey][this.count].start;
          this.endTime.value = storage[currentDateKey][this.count].end;
        }
      }
    }, 500);
  }

  @query('.start')
  startTime?:HTMLInputElement;

  @query('.end')
  endTime?:HTMLInputElement;

  @state()
  wakeUpTime: string = 'Еще не было первого сна';

  saveData() {
    if(this.startTime && this.endTime) {
      console.log(this.startTime.value, this.endTime.value);
      storage[currentDateKey] = {[this.count]: {start: this.startTime.value, end: this.endTime.value}};
      localStorage.setItem(storageKey, JSON.stringify(storage));
      this.count += 1;
      this.startTime.value = '';
      this.endTime.value = '';
      this.getWakeUpTime(this.count - 1);
    }
  }

  getWakeUpTime(count: number) {
    if(count>1) {
      const res = getHours(new Date(`${currentDateKey}, ${storage[currentDateKey][count].start}`),
          new Date(`${currentDateKey}, ${storage[currentDateKey][count].end}`));
      console.log(res);
      this.wakeUpTime = `${Math.floor(res)} часов ${(res - Math.floor(res)) * 60} минут`;
    }
    else this.wakeUpTime = 'Еще не было первого сна';
  }

  protected render(): unknown {
    return html`
      <div style="margin: auto; display: flex; flex-direction: column; justify-content: center; align-items: center">
        <h2>${this.count} сон</h2>
        <div style="display: flex; flex-direction: column; justify-content: right;">
          <label style="text-align: right">
            Время засыпания на ${this.count} сон
            <input class="start" type="time">
          </label>
          <br>
          <label style="text-align: right">
            Время пробуждения с ${this.count} сна
            <input class="end" type="time">
          </label>
          <br>
          <button type="button" @click="${this.saveData}">Готово</button>
        </div>
        <br>
        <h2>Время бодрствования</h2>
        <div>${this.wakeUpTime}</div>
      </div>
    `;
  }

  static styles = css`
    :host {
      width: 100%;
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    [tagName]: Main
  }
}

function getDate(d:Date):string {
  return `${d.getMonth() + 1}.${d.getDate()}.${d.getFullYear()}`;
}

function getHours(t1:Date, t2:Date):number {
  return (t2.getTime() - t1.getTime())/10**3/3600;
}