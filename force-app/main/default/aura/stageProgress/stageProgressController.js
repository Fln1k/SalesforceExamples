({
  loadStages: function (component, event, helper) {
    var opts = [
      { value: 1, label: "Account" },
      { value: 2, label: "Plan" },
      { value: 3, label: "Products" },
      { value: 4, label: "Comments" },
      { value: 5, label: "Info" },
      { value: 6, label: "Quote" },
    ];
    component.set("v.progressIndicatorStages", opts);
  },
  changeCurrentStageHandler: function (component, event, helper) {
    var options = component.get("v.progressIndicatorStages");
    var currentStage = component.get("v.currentStage");
    var canBack;
    var canNext;
    if (currentStage > parseInt(options[0].value)) {
      canBack = true;
    } else {
      canBack = false;
    }
    if (currentStage < parseInt(options.slice(-1).pop().value)) {
      canNext = true;
    } else {
      canNext = false;
    }
    component.set("v.canBack", canBack);
    component.set("v.canNext", canNext);
  },
});
