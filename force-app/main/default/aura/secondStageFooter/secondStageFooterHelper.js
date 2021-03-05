({
  setupCheckboxesData: function (component,accountType) {
    var getDependencies = component.get("c.getOpportunityDependencies");
    getDependencies.setCallback(this, function (response) {
      var result = JSON.parse(response.getReturnValue());
      var firstGroup = [];
      var secondGroup = [];
      var thirdGroup = [];
      var accountOrder = result["accountOrder"];
      var orderPayment = result["orderPayment"];
      Object.keys(accountOrder).forEach((type) => {
        firstGroup.push({
          value: type,
          label: type,
          checked: accountType == type,
          disabled: true,
        });
      });
      Object.keys(orderPayment).forEach((type) => {
        secondGroup.push({
          value: type,
          label: type,
          checked: false,
          disabled: !accountOrder[accountType].includes(type),
          allowed: orderPayment[type],
        });
        orderPayment[type].forEach((subType) => {
          thirdGroup.push({
            value: subType,
            label: subType,
            checked: false,
            disabled: true,
          });
        });
      });
      component.set(
        "v.firstCheckboxGroup",
        firstGroup.filter(
          (v, i, a) => a.findIndex((t) => t.value === v.value) === i
        )
      );
      component.set(
        "v.secondCheckboxGroup",
        secondGroup.filter(
          (v, i, a) => a.findIndex((t) => t.value === v.value) === i
        )
      );
      component.set(
        "v.thirdCheckboxGroup",
        thirdGroup.filter(
          (v, i, a) => a.findIndex((t) => t.value === v.value) === i
        )
      );
    });
    $A.enqueueAction(getDependencies);
  },
});
