({
  init: function (component, event, helper) {
    var opportunityId = window.location.href.split("/").slice(-2)[0];
    var getQuote = component.get("c.getOpportunityQuote");
    getQuote.setParams({
      opportunityId: opportunityId,
    });
    getQuote.setCallback(this, function (response) {
      var result = response.getReturnValue();
      console.log(result);
      if (result.length) {
        component.set("v.quoteId", result[0].Id);
        component.set("v.currentStage", 3);
      }
    });
    var getAccount = component.get("c.getOpportunityAccount");
    getAccount.setParams({
      opportunityId: opportunityId,
    });
    getAccount.setCallback(this, function (response) {
      var result = response.getReturnValue();
      console.log(result);
      $A.enqueueAction(getQuote);
      component.set("v.accountId", result.AccountId);
      component.set("v.opportunityId", opportunityId);
    });
    $A.enqueueAction(getAccount);
  },
});
