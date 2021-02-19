import { LightningElement, wire, api, track } from "lwc";
import getForecast from "@salesforce/apex/WeatherController.getForecast";
import { loadStyle } from "lightning/platformResourceLoader";
import Forecast from "@salesforce/resourceUrl/Forecast";

export default class LightningExampleInputSearch extends LightningElement {
  connectedCallback() {
    loadStyle(this, Forecast);
  }

  @api daysCount;
  @api cityName;
  @api currentVal;
  @track data = [];
  @track flagIndicatingDataHasBeenLoadedInVariables = false;

  handleLoad() {
    if (this.cityName.length > 0 && typeof this.daysCount != "undefined") {
      getForecast({ daysCount: this.daysCount, cityName: this.cityName })
        .then((result) => {
          this.data = result;
          this.flagIndicatingDataHasBeenLoadedInVariables = true;
        })
        .catch((error) => {});
    } else {
      alert("Please fill fields with valid data");
    }
  }

  get options() {
    return [
      { label: "1", value: "1" },
      { label: "2", value: "2" },
      { label: "3", value: "3" },
    ];
  }

  handleCityName(event) {
    this.cityName = event.detail.value;
  }

  handleDaysCount(event) {
    this.daysCount = event.detail.value;
  }

  handleChange(event) {}
}