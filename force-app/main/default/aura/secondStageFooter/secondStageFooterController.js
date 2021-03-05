({
  loadCheckboxGroups: function (component, event, helper) {
    if (component.get("v.paymentPlan").length == 0) {
      var accountType = component.get("v.accountType");
      helper.setupCheckboxesData(component,accountType);
    } else {
      component.get("v.secondCheckboxGroup").forEach((element) => {
        if (element.value == component.get("v.orderType")) {
          element.checked = true;
        } else {
          element.checked = false;
        }
      });
      component.get("v.thirdCheckboxGroup").forEach((element) => {
        if (element.value == component.get("v.paymentPlan")) {
          element.checked = true;
        } else {
          element.checked = false;
        }
      });
    }
  },
  configureThirdCombobox: function (component, event, helper) {
    var selectedValue = component.get("v.orderType");
    if (selectedValue.length > 0) {
      var secondGroup = component.get("v.secondCheckboxGroup");
      var result = secondGroup.filter((obj) => {
        return obj.value === selectedValue;
      });
      component.set("v.enabledOptions", result[0].allowed);
    } else {
      component.set("v.enabledOptions", []);
    }
  },
  handlePaymentPlanUndefined: function (component, event, helper) {
    if (!component.get("v.orderType")) {
      component.find("orderTypeGroup").showError();
    } else {
      component.find("paymentTypeGroup").showError();
    }
  },
});
