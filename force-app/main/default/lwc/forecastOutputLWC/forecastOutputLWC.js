import { LightningElement, track, api } from "lwc";
export default class ForecastOutputLWC extends LightningElement {
    @api location;
    @api forecastdays;
    @api nameInp;
   handleChangeName(event){ 
     this.nameInp = event.target.target.innerHTML;
     console.log(event);
     const myDemoEvent = new CustomEvent('demoevent',{
         detail:this.nameInp
        });
     this.dispatchEvent(myDemoEvent);
   }
}
