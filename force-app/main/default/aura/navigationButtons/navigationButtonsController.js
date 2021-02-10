({
  changeStageFunction: function (component, event, helper) {
    var valueToChange = parseInt(event.getSource().get("v.value"));
    var currentStage = parseInt(component.get("v.currentStage"));
    var isValid = true;
    if (valueToChange == 1) {
      if (currentStage == 1) {
        var accountId = component.get("v.accountId");
        if (!accountId.length) {
          isValid = false;
          $A.get("e.c:errorMessageOnAccountLookup").fire();
        }
        if (!component.get("v.opportunityId").length) {
          var action = component.get("c.createOpportunity");
          action.setParams({
            accountId: accountId,
            postfix: parseInt(component.get("v.accountOpportunitiesCount")) + 1,
          });
          action.setCallback(this, function (response) {
            var newOpportunityId = response.getReturnValue().Id;
            component.set("v.opportunityId", newOpportunityId);
          });
          $A.enqueueAction(action);
        }
      }
      if (currentStage == 2) {
        var paymentPlan = component.get("v.paymentPlan");
        if (!paymentPlan.length) {
          isValid = false;
          $A.get("e.c:paymentPlanUndefined").fire();
        }
      }
    }
    if (isValid) {
      var valueToAssign = currentStage + valueToChange;
      component.set("v.currentStage", valueToAssign);
    }
  },
  closeModalFunction: function (component, event, helper) {
    component.getEvent("closeModalEvent").fire();
  },
});
