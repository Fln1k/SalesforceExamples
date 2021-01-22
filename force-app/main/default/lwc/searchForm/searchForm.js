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
      var htmlToInsert =
        '<div class="slds-align_absolute-center" style="font-size: 4em; font-weight: bold;">' +
        cityName +
        `</div><br/><div style="display: grid;
        grid-template-columns: 300px 300px 300px;
        grid-gap: 50px;
        justify-content: center;
        align-items: center;
        font-family: 'Baloo Paaji 2', cursive;">`;
      data.forecast.forecastday.forEach(function createInnerHtml(forecastDay) {
        htmlToInsert +=
          `
          <div class="card" style="background-color: #222831;
          border-radius: 5px;
          display: flex;
          flex-direction: column;
          align-items: center;
          box-shadow: rgba(0, 0, 0, 0.7);
          color: white;">
        <p class="card__name" style="margin-top: 15px; font-size: 1.5em;">` +
          forecastDay.forecastDate +
          `</p>
        <div class="grid-container" style="  display: grid;
        grid-template-columns: 1fr 1fr;
        grid-gap: 20px;
        font-size: 1.2em;">
        <div class="grid-child-posts">Максимальная температура: ` +
          forecastDay.day.maxtemp_c +
          `<br>Минимальная температура: ` +
          forecastDay.day.mintemp_c +
          `</div>
        <div class="grid-child-followers">Средняя температура: ` +
          forecastDay.day.avgtemp_c +
          `</div>
        </div></div>`;
      });
      htmlToInsert += "</div>";
      this.template.querySelector(
        "#forecastOutput-97"
      ).innerHTML = htmlToInsert;
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
