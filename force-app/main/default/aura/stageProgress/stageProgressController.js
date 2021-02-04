({
  loadStages: function (component, event, helper) {
    var opts = [
      { value: 1, label: "Open" },
      { value: 2, label: "In Progress" },
      { value: 3, label: "Closed" },
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
