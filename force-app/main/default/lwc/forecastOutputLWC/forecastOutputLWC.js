import { LightningElement, track, api } from "lwc";
export default class ForecastOutputLWC extends LightningElement {
  @api location;
  @api forecastdays;
  @api dateClicked;
  handleChangeName(event) {
    const myDemoEvent = new CustomEvent("demoevent", {
      detail: event.target.innerHTML,
    });
    this.dispatchEvent(myDemoEvent);
  }
}
