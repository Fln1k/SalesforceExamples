({
  setUpOpportunityFilter: function (component, event, helper) {
    var opportunityLookupField = component.find("opportunityLookupField");
    var accountId = component.get("v.accountId");
    if (accountId.length) {
      opportunityLookupField.set("v.disabled", false);
    }
  },
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
    var opportunityLookupField = component.find("opportunityLookupField");
    if (id.length > 0) {
      var action = component.get("c.getCountOfAccountOpportunities");
      action.setParams({
        Id: id,
      });
      action.setCallback(this, function (response) {
        var opportunityIds = JSON.parse(response.getReturnValue());
        var opportunityDisabled;
        if (!opportunityIds.length) {
          opportunityDisabled = true;
        } else {
          if (opportunityIds.length == 1) {
            component.set("v.opportunityId", opportunityIds[0]);
          }
          opportunityDisabled = false;
          component.set("v.accountOpportunitiesCount", opportunityIds.length);
          component.set(
            "v.opportunityLookupFieldFilter",
            "AccountId='" + id + "' and  (NOT StageName like 'Closed%')"
          );
        }
        opportunityLookupField.set("v.disabled", opportunityDisabled);
      });
      $A.enqueueAction(action);
    } else {
      opportunityLookupField.set("v.disabled", true);
      opportunityLookupField.set("v.value", "");
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
  opportunityLookupFieldValueChange: function (component, event, helper) {
    var accountId = component.get("v.accountId");
    if (accountId.length) {
      component.set(
        "v.opportunityLookupFieldFilter",
        "AccountId='" + accountId + "' and  (NOT StageName like 'Closed%')"
      );
    }
  },
});
