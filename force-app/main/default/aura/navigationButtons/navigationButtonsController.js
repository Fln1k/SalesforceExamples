({
  initializeButtons: function (component, event, helper) {
    component.set("v.canBack", false);
    component.set("v.canNext", true);
  },
  changeStageFunction: function (component, event, helper) {
    var changeValue = event.getSource().get("v.value");
    var changeEvent = $A.get("e.c:changeStage");
    changeEvent.setParams({ "value": changeValue });
    changeEvent.fire();
  },
  handleButtonsAvailableState: function (component, event, helper) {
  
    component.set("v.canBack", event.getParam("canBack"));
    component.set("v.canNext", event.getParam("canNext"));
  },
  closeModalFunction: function (component, event, helper) {
    component.getEvent("closeModalEvent").fire();
  },
});
