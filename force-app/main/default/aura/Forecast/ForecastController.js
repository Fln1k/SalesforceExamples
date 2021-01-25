({
    onFormSubmit : function(component, event, helper) {
        var action = component.get("c.getForecast");
        action.setParams({ cityName : component.get("v.cityName"), daysCount : component.find('selectDays').get('v.value') });
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                var data =  response.getReturnValue()
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
                    cityNameBlock.innerHTML = component.get("v.cityName");
                    forecastBlock.appendChild(degreeBlock);
                    forecastBlock.appendChild(cityNameBlock);
                    widget.appendChild(dateBlock);
                    widget.appendChild(forecastBlock);
                    wrapper.appendChild(widget);
                  });
                  document.getElementById("forecastOutput").innerHTML = "";
                  document.getElementById("forecastOutput").appendChild(wrapper);
            }
            else if (state === "INCOMPLETE") {
                console.log("state INCOMPLETE")
            }
            else if (state === "ERROR") {
                var errors = response.getError();
                if (errors) {
                    if (errors[0] && errors[0].message) {
                        console.log("Error message: " + 
                                 errors[0].message);
                    }
                } else {
                    console.log("Unknown error");
                }
            }
        });
        $A.enqueueAction(action);
    }
})
