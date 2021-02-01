({
  initializeButtons: function (component, event, helper) {
    component.set("v.canBack", false);
    component.set("v.canNext", true);
    component.set("v.canFinish", false);
  },
  changeStageFunction: function (component, event, helper) {
    var changeValue = event.getSource().get("v.value");
    console.log("fire event to change stage value to " + changeValue);
    var changeEvent = $A.get("e.c:changeStage");
    changeEvent.setParams({ "value": changeValue });
    changeEvent.fire();
  },
  handleButtonsAvailableState: function (component, event, helper) {
    component.set("v.canBack", event.getParam("canBack"));
    component.set("v.canNext", event.getParam("canNext"));
  },
});
