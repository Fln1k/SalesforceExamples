import { LightningElement, track, api } from "lwc";
export default class ForecastOutputLWC extends LightningElement {
    @api location;
    @api forecastdays;
}
