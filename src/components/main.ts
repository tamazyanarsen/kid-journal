import {css, html, LitElement} from 'lit'
import {customElement, state, property, query} from 'lit/decorators.js'

const tagName = 'main-element';

export type SleepJournal = {
  [key:string]: {[key:string]:{start: string, end:string}};
}

const storageKey = 'sleep-journal';

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
    setTimeout(()=>{if(this.startTime)this.startTime.value = '14:32'}, 2000);
  }

  connectedCallback() {
    super.connectedCallback();
    setTimeout(()=>{
    // TODO set init value from storage to input fields (start, end)
    }))
  }

  @query('.start')
  startTime?:HTMLInputElement;

  @query('.end')
  endTime?:HTMLInputElement;

  @state()
  textFlag = true;

  saveData() {
    if(this.startTime && this.endTime) {
      console.log(this.startTime.value, this.endTime.value);
      storage[this.count] = {start: this.startTime.value, end: this.endTime.value};
      // localStorage.setItem(storageKey, JSON.stringify(storage));
      this.count += 1;
    }
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