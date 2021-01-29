({
  init: function (component) {
    var flowName = component.get("v.flowName");

    if (flowName) {
      var flow = component.find("caseFlow");
      var flowName = component.get("v.flowName");
      flow.startFlow(flowName);
    }
  },
  handleStatusChange: function (component, event) {
    var flowName = component.get("v.flowName");
    if (flowName) {
      component.set("v.currentStage", event.getParam("currentStage"));
      component.set("v.activeStages", event.getParam("activeStages"));

      var currentStage = component.get("v.currentStage");
      var activeStages = component.get("v.activeStages");
      var statusChanged = $A.get("e.c:statusChanged");
      statusChanged.setParams({
        currentStage: currentStage,
        activeStages: activeStages,
      });
      statusChanged.fire();
    }
  },
});
