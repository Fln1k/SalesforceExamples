import { LightningElement, wire, api, track } from "lwc";
import getForecast from "@salesforce/apex/WeatherController.getForecast";
import { loadStyle } from 'lightning/platformResourceLoader';
import Forecast from '@salesforce/resourceUrl/Forecast'

export default class LightningExampleInputSearch extends LightningElement {
      connectedCallback() {
        loadStyle(this, Forecast); 
    }

  @api daysCount;
  @api cityName;
  @track data = [];

  @wire(getForecast, { daysCount: "$daysCount", cityName: "$cityName" })
  wiredRecordsMethod({ error, data }) {
    console.log("wire method call");
    if (data) {
      this.data = data;
      var cityName = "";
      if (typeof this.cityName != "undefined") {
        cityName = this.cityName;
      }
      console.log(data);
      let createElementWithClass = function (elementName, className) {
        let tempElement = document.createElement(elementName);
        tempElement.classList.add(className);
        return tempElement;
      };

      let wrapper = createElementWithClass("div", "wrapper");
      data.forecast.forecastday.forEach(function createInnerHtml(forecastDay) {
        let widget = createElementWithClass("div", "widget");
        let dateBlock = document.createElement("i");
        dateBlock.innerHTML = forecastDay.forecastDate;
        let forecastBlock = document.createElement("div");
        let degreeBlock = createElementWithClass("p", "degree");
        degreeBlock.innerHTML = forecastDay.day.avgtemp_c;
        let cityNameBlock = createElementWithClass("p", "country");
        cityNameBlock.innerHTML = cityName;
        forecastBlock.appendChild(degreeBlock);
        forecastBlock.appendChild(cityNameBlock);
        widget.appendChild(dateBlock);
        widget.appendChild(forecastBlock);
        wrapper.appendChild(widget);
      });
      this.template.querySelector('[data-id="forecastOutput"]').innerHTML = "";
      this.template
        .querySelector('[data-id="forecastOutput"]')
        .appendChild(wrapper);
    } else if (error) {
      console.log("error");
      console.log(error);
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
    console.log(
      "change city name from " + this.cityName + " to " + event.detail.value
    );
    this.cityName = event.detail.value;
  }
  handleDaysCount(event) {
    console.log(
      "change days amount from " + this.daysCount + " to " + event.detail.value
    );
    this.daysCount = event.detail.value;
  }
}
