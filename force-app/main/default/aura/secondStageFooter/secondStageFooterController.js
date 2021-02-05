({
  loadCheckboxGroups: function (component, event, helper) {
    var firstGroup = [
      { value: 1, label: "New", helpText: "New customer" },
      { value: 2, label: "Existing", helpText: "Existing customer" },
    ];
    var secondGroup = [
      { value: 1, label: "New", helpText: "First time order" },
      { value: 2, label: "Reorder", helpText: "Not first time order" },
    ];
    var thirdGroup = [
      { value: 1, label: "Plan 1" },
      { value: 2, label: "Plan 2" },
      { value: 3, label: "Plan 3" },
    ];
    component.set("v.firstCheckboxGroup", firstGroup);
    component.set("v.secondCheckboxGroup", secondGroup);
    component.set("v.thirdCheckboxGroup", thirdGroup);
  },
});
