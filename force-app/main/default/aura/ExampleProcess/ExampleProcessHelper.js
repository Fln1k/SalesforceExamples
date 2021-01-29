({
  initPath: function (component, event, helper) {
    var progressIndicator = component.find("progressIndicator");
    var body = [];
    var activeStages = component.get("v.activeStages");
    activeStages.forEach((stage) => {
      $A.createComponent(
        "lightning:progressStep",
        {
          "aura:id": "step_" + stage.name,
          label: stage.label,
          value: stage.name,
        },
        function (newProgressStep, status, errorMessage) {
          if (status === "SUCCESS") {
            body.push(newProgressStep);
            progressIndicator.set("v.body", body);
          }
        }
      );
    });
  },
});
