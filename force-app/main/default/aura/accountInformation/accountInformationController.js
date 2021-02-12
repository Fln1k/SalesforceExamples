({
  init: function (component, event, helper) {
    console.log(component.get("v.billingCountry"))
    var action = component.get("c.getAvailableCountries");
    action.setCallback(this, function (response) {
      var shippingCountryOptions = [];
      var billingCountryOptions = [];
      var accountCountry = component.get("v.billingCountry");
      billingCountryOptions.push({
        label: accountCountry,
        value: accountCountry,
      });
      var result = JSON.parse(response.getReturnValue());
      result.forEach((element) => {
        shippingCountryOptions.push({
          label: element.label,
          value: element.value,
        });
      });
      console.log(billingCountryOptions);
      component.set("v.shippingCountryOptions", shippingCountryOptions);
      component.set("v.billingCountryOptions", billingCountryOptions);
    });
    $A.enqueueAction(action);
  },
});
