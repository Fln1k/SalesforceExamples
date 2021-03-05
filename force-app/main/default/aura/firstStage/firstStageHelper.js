({
  setupAccountInfo: function (component, accountId) {
    var getAccountInfo = component.get("c.getCurrentAccountInfo");
    getAccountInfo.setParams({
      accountId: accountId,
    });
    getAccountInfo.setCallback(this, function (response) {
      var result = response.getReturnValue();
      component.set("v.accountType", result.Customer_type__c);
    });
    $A.enqueueAction(getAccountInfo);
  },
  setupOpportunityInfo: function (component, accountId) {
    var getAccountOpportunities = component.get("c.getAccountOpportunities");
    getAccountOpportunities.setParams({
      accountId: accountId,
    });
    getAccountOpportunities.setCallback(this, function (response) {
      var opportunities = response.getReturnValue();
      var availableOpportunities = [];
      opportunities.forEach(function (opportunity) {
        if (!opportunity.StageName.includes("Closed")) {
          availableOpportunities.push(opportunity);
        }
      });
      var opportunityDisabled = false;
      var availableOpportunitiesLength = availableOpportunities.length;
      if (!availableOpportunitiesLength) {
        opportunityDisabled = true;
      } else {
        if (availableOpportunitiesLength == 1) {
          component.set("v.opportunityId", availableOpportunities[0].Id);
        }
        opportunityDisabled = false;
        component.set(
          "v.accountOpportunitiesCount",
          availableOpportunitiesLength
        );
        component.set(
          "v.opportunityLookupFieldFilter",
          "AccountId='" + accountId + "' and  (NOT StageName like 'Closed%')"
        );
      }
      component.set("v.opportunityFieldDisabled", opportunityDisabled);
    });
    $A.enqueueAction(getAccountOpportunities);
  },
});
