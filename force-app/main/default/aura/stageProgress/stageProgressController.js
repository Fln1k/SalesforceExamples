({
  loadStages: function (component, event, helper) {
    var opts = [
      { value: "1", label: "Open" },
      { value: "2", label: "In Progress" },
      { value: "3", label: "Closed" },
    ];
    component.set("v.progressIndicatorStages", opts);
  },
  handleChangeStage: function (component, event, helper) {
    var valueToChange = parseInt(event.getParam("value"));
    var currentStage = parseInt(component.get("v.currentStage"));
    var valueToAssign = currentStage + valueToChange;
    component.set("v.currentStage", valueToAssign.toString());
    var options = component.get("v.progressIndicatorStages");
    var canBack;
    var canNext;
    if (valueToAssign > parseInt(options[0].value)) {
      canBack = true;
    } else {
      canBack = false;
    }
    if (valueToAssign < parseInt(options.slice(-1).pop().value)) {
      canNext = true;
    } else {
      canNext = false;
    }
    var changeButtonsEvent = $A.get("e.c:changeButtonsAvailableState");
    changeButtonsEvent.setParams({ 
      "canBack": canBack,
      "canNext": canNext
    });
    changeButtonsEvent.fire();
    
    var changeFlowContentEvent = $A.get("e.c:changeFlowContent");
    changeFlowContentEvent.setParams({ 
      "stage": valueToAssign
    });
    changeFlowContentEvent.fire();
  },
});
