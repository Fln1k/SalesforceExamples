({
  init: function (component, event, helper) {
    var countryOptions = [];
    var action = component.get("c.getAvailableCountries");
    action.setCallback(this, function (response) {
      var result = JSON.parse(response.getReturnValue());
      result.forEach((element) => {
        countryOptions.push({
          label: element.label,
          value: element.value,
        });
      });
      component.set("v.countryOptions", countryOptions);
    });
    $A.enqueueAction(action);
  },
  closeModal: function (component, event, helper) {
    component.find("newAccountOverlay").notifyClose();
  },
  saveAccount: function (component, event, helper) {
    var name = component.get("v.newAccountNameField");
    var country = component.get("v.newAccountCountryField");
    var allValid = component
      .find("newAccountField")
      .reduce(function (validSoFar, inputCmp) {
        inputCmp.showHelpMessageIfInvalid();
        return validSoFar && !inputCmp.get("v.validity").valueMissing;
      }, true);
    if (allValid) {
      component.set("v.IsSpinner", true);
      var action = component.get("c.createAccount");
      action.setParams({
        name: name,
        country: country,
      });
      action.setCallback(this, function (response) {
        var assignLookupIdEvent = $A.get("e.c:assignAccountId");
        assignLookupIdEvent.setParams({ id: response.getReturnValue().Id });
        assignLookupIdEvent.fire();
        component.set("v.newAccountNameField", "");
        component.set("v.newAccountCountryField", "");
        component.set("v.IsSpinner", false);
        $A.enqueueAction(component.get("c.closeModal"));
      });
      $A.enqueueAction(action);
    }
  },
});
