({
  loadCheckboxGroups: function (component, event, helper) {
    var isNew = !component.get("v.closedOpportunitiesAmount");
    var firstGroup = [
      {
        value: "New",
        label: "New",
        helpText: "New customer",
        checked: isNew,
        disabled: true,
      },
      {
        value: "Existing",
        label: "Existing",
        helpText: "Existing customer",
        checked: !isNew,
        disabled: true,
      },
    ];
    var secondGroup = [
      {
        value: "New",
        label: "New",
        helpText: "First time order",
        block: ["Plan 1", "Plan 2", "Plan 3", "Plan 4", "Plan 6"],
        disabled: !isNew,
      },
      {
        value: "Reorder",
        label: "Reorder",
        helpText: "Not first time order",
        block: ["Plan 1", "Plan 3", "Plan 5"],
        disabled: isNew,
      },
      {
        value: "Test",
        label: "Test",
        helpText: "test order",
        block: ["Plan 2", "Plan 4", "Plan 5"],
        disabled: isNew,
      },
    ];
    var thirdGroup = [
      { value: "Plan 1", label: "Plan 1", disabled: true },
      { value: "Plan 2", label: "Plan 2", disabled: true },
      { value: "Plan 3", label: "Plan 3", disabled: true },
      { value: "Plan 4", label: "Plan 4", disabled: true },
      { value: "Plan 5", label: "Plan 5", disabled: true },
      { value: "Plan 6", label: "Plan 6", disabled: true },
    ];
    var orderType = component.get("v.orderType");
    var paymentPlan = component.get("v.paymentPlan");
    if (orderType) {
      var secondGroupChecked = secondGroup.filter((obj) => {
        return obj.value === orderType;
      });
      secondGroupChecked[0].checked = true;
      thirdGroup.forEach((element) => {
        if (!secondGroupChecked[0].block.includes(element.value)) {
          element.disabled = false;
        }
        if (element.value == paymentPlan) {
          element.checked = true;
        }
      });
    }
    component.set("v.firstCheckboxGroup", firstGroup);
    component.set("v.secondCheckboxGroup", secondGroup);
    component.set("v.thirdCheckboxGroup", thirdGroup);
  },
  configureThirdCombobox: function (component, event, helper) {
    var selectedValue = component.get("v.orderType");
    if (selectedValue.length > 0) {
      var secondGroup = component.get("v.secondCheckboxGroup");
      var result = secondGroup.filter((obj) => {
        return obj.value === selectedValue;
      });
      component.set("v.disabledOptions", result[0].block);
    } else {
      component.set("v.disabledOptions", [
        "Plan 1",
        "Plan 2",
        "Plan 3",
        "Plan 4",
        "Plan 5",
        "Plan 6",
      ]);
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
