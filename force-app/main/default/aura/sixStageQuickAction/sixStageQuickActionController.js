({
  init: function (component, event, helper) {
    var quoteId = component.get("v.recordId");
    var opportunityId = "";
    var getOpportunity = component.get("c.getOpportunityIdByQuoteId");
    getOpportunity.setParams({
      quoteId: quoteId,
    });
    getOpportunity.setCallback(this, function (response) {
      var result = response.getReturnValue();
      opportunityId = result;
      component.set("v.opportunityId", opportunityId);
      component.set("v.currentStage", 6);
    });
    $A.enqueueAction(getOpportunity);
  },
});
