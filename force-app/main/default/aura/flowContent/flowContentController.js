({
  handlechangeFlowContent: function (component, event, helper) {
    var currentStage = parseInt(event.getParam("stage"));
    component.set("v.currentStage", currentStage);
  },
});
