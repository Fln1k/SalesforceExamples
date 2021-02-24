({
  setUpOpportunityFilter: function (component, event, helper) {
    if (component.get("v.accountId").length > 0) {
      component.set("v.disabled", false);
    }
    $A.enqueueAction(component.get("c.opportunityLookupFieldValueChange"));
  },
  opportunityLookupFieldValueChange: function (component, event, helper) {
    component.set("v.canMoveToEnd", false);
    var getQuote = component.get("c.getOpportunityQuote");
    getQuote.setParams({
      opportunityId: component.get("v.opportunityId"),
    });
    getQuote.setCallback(this, function (response) {
      var result = response.getReturnValue();
      if (result) {
        component.set("v.quoteId", result.Id);
        component.set("v.canMoveToEnd", true);
      }
    });
    $A.enqueueAction(getQuote);
  },
  newOpportunityCreation: function (component, event, helper) {
    var action = component.get("c.createOpportunity");
    action.setParams({
      accountId: component.get("v.accountId"),
    });
    action.setCallback(this, function (response) {
      var newOpportunityId = response.getReturnValue().Id;
      component.set("v.opportunityId", newOpportunityId);
    });
    $A.enqueueAction(action);
  },
});
