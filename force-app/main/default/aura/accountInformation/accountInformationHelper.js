({
  setupAccountInfo: function (component, accountId) {
    var getAccountInfo = component.get("c.getCurrentAccountInfo");
    getAccountInfo.setParams({
      accountId: accountId,
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
        result.BillingState ? result.BillingState : ""
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
        result.ShippingState ? result.ShippingState : ""
      );
      this.setupAdresses(component);
    });
    $A.enqueueAction(getAccountInfo);
  },

  setupAdresses: function (component) {
    var action = component.get("c.getAvailableCountries");
    action.setCallback(this, function (response) {
      var shippingCountryOptions = [];
      var billingCountryOptions = [];
      var stateOptions = {};
      var shippingCountry = component.get("v.shippingCountry");
      var billingCountry = component.get("v.billingCountry");
      var shippingProvince = component.get("v.shippingProvince");
      var billingProvince = component.get("v.billingProvince");

      shippingCountryOptions.push({
        label: shippingCountry,
        value: shippingCountry,
      });
      var result = JSON.parse(response.getReturnValue());
      var shippingCountryValue = "";
      var billingCountryValue = "";
      result["countries"].forEach((country) => {
        billingCountryOptions.push({
          label: country.label,
          value: country.value,
        });
        if (country.label == billingCountry) {
          billingCountryValue = country.value;
        }
        if (country.label == shippingCountry) {
          shippingCountryValue = country.value;
        }
        var dependency = result["dependency"][country.value];
        var states = result["states"].filter((obj) => {
          return dependency.includes(obj.value);
        });
        stateOptions[country.value] = states;
      });
      var shippingProvinceValue = "";
      var billingProvinceValue = "";
      result["states"].forEach((state) => {
        if (state.label == shippingProvince) {
          shippingProvinceValue = state.value;
        }
        if (state.label == billingProvince) {
          billingProvinceValue = state.value;
        }
      });
      component.set("v.stateOptions", stateOptions);
      component.set("v.shippingCountryOptions", shippingCountryOptions);
      component.set("v.billingCountryOptions", billingCountryOptions);
      component.set("v.shippingProvinceValue", shippingProvinceValue);
      component.set("v.billingProvinceValue", billingProvinceValue);
      component.set("v.shippingCountryValue", shippingCountryValue);
      component.set("v.billingCountryValue", billingCountryValue);
    });
    $A.enqueueAction(action);
  },
});
