({
  handleAssignAccountId: function (component, event, helper) {
    component.find("accountLookupField").set("v.value", "");
    component.set("v.accountId", event.getParam("id"));
  },
  handleErrorMessageOnAccountLookup: function (component, event, helper) {
    component.find("accountLookupField").set("v.error", true);
  },
  accountLookupFieldValueChange: function (component, event, helper) {
    var id = event.getParam("value");
    component.find("accountLookupField").set("v.error", false);
    if (id.length > 0) {
      var action = component.get("c.getAccountOpportunities");
      action.setParams({
        accountId: id,
      });
      action.setCallback(this, function (response) {
        var opportunities = response.getReturnValue();
        var closedOpportunitiesCounter = 0;
        var availableOpportunities = [];
        opportunities.forEach(function (opportunity) {
          if (opportunity.StageName.includes("Closed")) {
            ++closedOpportunitiesCounter;
          } else {
            availableOpportunities.push(opportunity);
          }
        });
        component.set(
          "v.closedOpportunitiesAmount",
          closedOpportunitiesCounter
        );
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
            "AccountId='" + id + "' and  (NOT StageName like 'Closed%')"
          );
        }
        component.set("v.opportunityFieldDisabled", opportunityDisabled);
      });
      $A.enqueueAction(action);
    } else {
      component.set("v.opportunityFieldDisabled", true);
      component.set("v.opportunityId", "");
      component.set("v.productsOptions", []);
      component.set("v.paymentPlan", "");
      component.set("v.orderType", "");
      component.set("v.canMoveToEnd", false);
    }
  },
  showNewAccount: function (component) {
    $A.createComponent("c:newAccount", {}, function (content, status) {
      if (status === "SUCCESS") {
        var modalBody = content;
        component
          .find("newAccountOverlay")
          .showCustomModal({
            header: "New Account",
            body: modalBody,
            showCloseButton: true,
            closeCallback: function (ovl) {},
          })
          .then(function (overlay) {});
      }
    });
  },
});
