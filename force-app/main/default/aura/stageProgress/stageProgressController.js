({
  loadStages: function (component, event, helper) {
    var opts = [
      { value: 1, label: "Account select" },
      { value: 2, label: "Plan Select" },
      { value: 3, label: "3 stage" },
      { value: 4, label: "4 stage" },
      { value: 5, label: "5 stage" },
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
