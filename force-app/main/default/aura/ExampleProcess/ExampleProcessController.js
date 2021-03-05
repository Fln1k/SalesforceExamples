({
  doInit: function (component, event, helper) {
    helper.initPath(component, event, helper);
  },
  handleStatusChanged: function (component, event, helper) {
    console.log("stage label:");
    console.log(event.getParam("currentStage").label);
    component.set("v.currentStage", event.getParam("currentStage"));
    component.set("v.activeStages", event.getParam("activeStages"));
    helper.initPath(component, event, helper);
  },
});