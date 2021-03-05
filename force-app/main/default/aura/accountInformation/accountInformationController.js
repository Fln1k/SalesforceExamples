({
  init: function (component, event, helper) {
    helper.setupAccountInfo(component, component.get("v.accountId"));
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
