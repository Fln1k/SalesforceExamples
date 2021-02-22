({
    opportunityLookupFieldValueChange: function (component, event, helper) {
        var getQuote = component.get("c.getOpportunityQuote");
        getQuote.setParams({
          opportunityId: event.getParam("value"),
        });
        getQuote.setCallback(this, function (response) {
          var result = response.getReturnValue();
          if (result.length) {
            component.set("v.quoteId", result[0].Id);
            component.set("v.canMoveToEnd", true);
          }
        });
        $A.enqueueAction(getQuote);
      },
})
