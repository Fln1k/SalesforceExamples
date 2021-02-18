({
  init: function (component, event, helper) {
    var action = component.get("c.getAvailableCountries");
    action.setCallback(this, function (response) {
      var shippingCountryOptions = [];
      var billingCountryOptions = [];
      var accountCountry = component.get("v.shippingCountry");
      shippingCountryOptions.push({
        label: accountCountry,
        value: accountCountry,
      });
      var result = JSON.parse(response.getReturnValue());
      result.forEach((element) => {
        billingCountryOptions.push({
          label: element.label,
          value: element.label,
        });
      });
      component.set("v.shippingCountryOptions", shippingCountryOptions);
      component.set("v.billingCountryOptions", billingCountryOptions);
    });
    $A.enqueueAction(action);

    var getAccountInfo = component.get("c.getCurrentAccountInfo");
    getAccountInfo.setParams({
      accountId: component.get("v.accountId"),
    });
    getAccountInfo.setCallback(this, function (response) {
      var result = response.getReturnValue();
      component.set(
        "v.billingStreet",
        result.BillingStreet ? result.BillingStreet : ""
      );
      component.set(
        "v.billingCity",
        result.BillingCity ? result.BillingCity : ""
      );
      component.set(
        "v.billingCountry",
        result.BillingCountry ? result.BillingCountry : ""
      );
      component.set(
        "v.billingPostalCode",
        result.BillingPostalCode ? result.BillingPostalCode : ""
      );
      component.set(
        "v.billingProvince",
        result.BillingProvince ? result.BillingProvince : ""
      );
      component.set(
        "v.shippingStreet",
        result.ShippingStreet ? result.ShippingStreet : ""
      );
      component.set(
        "v.shippingCity",
        result.ShippingCity ? result.ShippingCity : ""
      );
      component.set(
        "v.shippingCountry",
        result.ShippingCountry ? result.ShippingCountry : ""
      );
      component.set(
        "v.shippingPostalCode",
        result.ShippingPostalCode ? result.ShippingPostalCode : ""
      );
      component.set(
        "v.shippingProvince",
        result.ShippingProvince ? result.ShippingProvince : ""
      );
    });
    $A.enqueueAction(getAccountInfo);
  },
  handleErrorCheck: function (component, event, helper) {
    component.find("requiredInput").reduce(function (validSoFar, inputCmp) {
      inputCmp.showHelpMessageIfInvalid();
      return validSoFar && !inputCmp.get("v.validity").valueMissing;
    }, true);
  },
});
