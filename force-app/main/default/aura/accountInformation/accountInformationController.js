({
  init: function (component, event, helper) {
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
      result["countries"].forEach((country) => {
        billingCountryOptions.push({
          label: country.label,
          value: country.value,
        });
        if (country.label == billingCountry) {
          component.set("v.billingCountryValue", country.value);
        }
        if (country.label == shippingCountry) {
          component.set("v.shippingCountryValue", country.value);
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
    });

    var getAccountInfo = component.get("c.getCurrentAccountInfo");
    getAccountInfo.setParams({
      accountId: component.get("v.accountId"),
    });
    getAccountInfo.setCallback(this, function (response) {
      var result = response.getReturnValue();
      console.log(result);
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
      $A.enqueueAction(action);
    });
    $A.enqueueAction(getAccountInfo);
  },
  handleErrorCheck: function (component, event, helper) {
    component.find("requiredInput").reduce(function (validSoFar, inputCmp) {
      inputCmp.showHelpMessageIfInvalid();
      return validSoFar && !inputCmp.get("v.validity").valueMissing;
    }, true);
  },

  updateBillingProvinces: function (component, event, helper) {
    var country = component.get("v.billingCountryValue");
    var state = component.get("v.billingProvinceValue");
    if (component.get("v.previousBillingCountry") !== country) {
      component.set(
        "v.billingStateOptions",
        component.get("v.stateOptions")[country]
      );
      var billingCountryOptions = component.get("v.billingCountryOptions");
      component.set(
        "v.billingCountry",
        billingCountryOptions.filter((obj) => {
          return obj.value == country;
        })[0].label
      );
      component.set("v.previousBillingCountry", country);
    }
    if (component.get("v.previousBillingState") !== state) {
      if (component.get("v.previousBillingState").length > 0) {
        component.set(
          "v.billingProvince",
          component.get("v.stateOptions")[country].filter((obj) => {
            return obj.value == state;
          })[0].label
        );
      } else {
        component.set("v.billingProvince", "");
      }
      component.set("v.previousBillingState", state);
    }
  },

  updateShippingProvinces: function (component, event, helper) {
    var country = component.get("v.shippingCountryValue");
    var state = component.get("v.shippingProvinceValue");

    if (component.get("v.previousShippingCountry") !== country) {
      component.set(
        "v.shippingStateOptions",
        component.get("v.stateOptions")[country]
      );
      component.set("v.previousShippingCountry", country);
    }
    if (component.get("v.previousShippingState") !== state) {
      if (component.get("v.previousShippingState").length > 0) {
        component.set(
          "v.shippingProvince",
          component.get("v.stateOptions")[country].filter((obj) => {
            return obj.value == state;
          })[0].label
        );
      } else {
        component.set("v.shippingProvince", "");
      }
      component.set("v.previousShippingState", state);
    }
  },

  updateAccountCall: function (component, event, helper) {
    var updateAccountInfo = component.get("c.updateAccount");
    updateAccountInfo.setParams({
      account: {
        Id: component.get("v.accountId"),
        BillingStreet: component.get("v.billingStreet"),
        BillingCity: component.get("v.billingCity"),
        BillingCountry: component.get("v.billingCountry"),
        BillingPostalCode: component.get("v.billingPostalCode"),
        BillingState: component.get("v.billingProvince"),
        ShippingStreet: component.get("v.shippingStreet"),
        ShippingCity: component.get("v.shippingCity"),
        ShippingCountry: component.get("v.shippingCountry"),
        ShippingPostalCode: component.get("v.shippingPostalCode"),
        ShippingState: component.get("v.shippingProvince"),
      },
    });
    $A.enqueueAction(updateAccountInfo);
  },
});
