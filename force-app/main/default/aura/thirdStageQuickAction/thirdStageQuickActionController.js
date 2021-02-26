({
  init: function (component, event, helper) {
    component.set("v.IsSpinner", true);
    var quoteId = component.get("v.recordId");
    var opportunityId = "";
    var getAccount = component.get("c.getOpportunity");
    var getOpportunity = component.get("c.getOpportunityIdByQuoteId");
    getOpportunity.setParams({
      quoteId: quoteId,
    });
    getOpportunity.setCallback(this, function (response) {
      var result = response.getReturnValue();
      opportunityId = result;
      getAccount.setParams({
        opportunityId: opportunityId,
      });
      getAccount.setCallback(this, function (response) {
        var result = response.getReturnValue();
        component.set("v.accountId", result.AccountId);
        component.set("v.opportunityId", opportunityId);
        component.set("v.currentStage", 3);
        component.set("v.IsSpinner", false);
      });
      $A.enqueueAction(getAccount);
    });
    $A.enqueueAction(getOpportunity);
  },
});
