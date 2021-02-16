({
  onFormSubmit: function (component, event, helper) {
    var cityName = component.get("v.cityName");
    var dayCount = component.get("v.daysAmount");
    if (cityName.length > 0 && typeof dayCount != "undefined") {
      var action = component.get("c.getForecast");
      action.setParams({
        cityName: cityName,
        daysCount: dayCount,
      });
      action.setCallback(this, function (response) {
        var state = response.getState();
        if (state === "SUCCESS") {
          var data = response.getReturnValue();
          component.set("v.flagIndicatingDataHasBeenLoadedInVariables", "true");
          component.set("v.forecast", data);
        } else if (state === "INCOMPLETE") {

        } else if (state === "ERROR") {
          var errors = response.getError();
          if (errors) {
            if (errors[0] && errors[0].message) {
            }
          } else {
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
  handleComponentEvent: function (component, event, helper) {
    var valueFromChild = event.getParam("date");
    component.set("v.clickedDate", valueFromChild);
  },
});
