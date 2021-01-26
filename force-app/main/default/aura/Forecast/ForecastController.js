({
  onFormSubmit: function (component, event, helper) {
    if (component.get("v.cityName").length > 0 && typeof component.find("selectDays").get("v.value") != "undefined") {
      var cityName = component.get("v.cityName");
      var dayCount = component.find("selectDays").get("v.value");
      var action = component.get("c.getForecast");
      action.setParams({
        cityName: cityName,
        daysCount: dayCount,
      });
      action.setCallback(this, function (response) {
        var state = response.getState();
        if (state === "SUCCESS") {
          var data = response.getReturnValue();
          var forecastOutputComponent = component.find(
            "forecastOutputComponent"
          );
          forecastOutputComponent.set("v.forecast", data);
        } else if (state === "INCOMPLETE") {
          console.log("state INCOMPLETE");
        } else if (state === "ERROR") {
          var errors = response.getError();
          if (errors) {
            if (errors[0] && errors[0].message) {
              console.log("Error message: " + errors[0].message);
            }
          } else {
            console.log("Unknown error");
          }
        }
      });
      $A.enqueueAction(action);
    } else {
      alert("Please fill fields with valid data");
    }
  },
  loadOptions: function (component, event, helper) {
    var opts = [
      { value: "1", label: "1" },
      { value: "2", label: "2" },
      { value: "3", label: "3" },
    ];
    component.set("v.options", opts);
  },
});
