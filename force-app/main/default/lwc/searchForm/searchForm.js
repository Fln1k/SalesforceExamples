import { LightningElement, wire, api, track } from "lwc";
import { refreshApex } from "@salesforce/apex";
import getForecast from "@salesforce/apex/WeatherController.getForecast";

export default class LightningExampleInputSearch extends LightningElement {
  queryTerm;

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
      var htmlToInsert =`<div class="wrapper" style="position: absolute;
      top: 35%;
      left: 5%;
      height: 300px;">`;
      data.forecast.forecastday.forEach(function createInnerHtml(forecastDay) {
        htmlToInsert +=
          `
          <div class="widget" style="margin-right: 31px; position: relative;
          display: inline-block;
          box-sizing: content-box;
          width: 228px;
          height: 228px;
          padding: 36px;
          border-radius: 6px;
          background-color: #fff;
          box-shadow: 0 0 15px #ddd;">
            <i> ` + forecastDay.forecastDate + `</i>
            <div style="font-weight: 300;
            position: absolute;
            bottom: 36px;
            color: #b8b8b8;">
              <p class="degree" style="font-size: 4em;">` + forecastDay.day.avgtemp_c + `°</p>
              <p class="country" style="    font-size: 2em;
              line-height: 10px;
              color: #cbcbcb;">` + cityName + `</p>
            </div>
          </div>`;
      });
      htmlToInsert += "</div>";
      this.template.querySelector('[data-id="forecastOutput"]').innerHTML = htmlToInsert;
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
