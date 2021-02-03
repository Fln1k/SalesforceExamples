({
  handleAssignAccountId: function (component, event, helper) {
    component.find("accountLookupField").set("v.value","");
    component.set("v.accountId", event.getParam("id"));
  },
  accountLookupFieldValueChange: function (component, event, helper) {
    var id = event.getParam("value");
    var opportunityLookupField = component.find("opportunityLookupField");
    if (id.length > 0) {
      var action = component.get("c.getCountOfAccountOpportunities");
      action.setParams({
        Id: id,
      });
      action.setCallback(this, function (response) {
        var opportunityIds = JSON.parse(response.getReturnValue());
        console.log(opportunityIds);
        var opportunityDisabled;
        if (!opportunityIds.length) {
          opportunityDisabled = true;
        } else {
          if (opportunityIds.length == 1) {
            component.set("v.opportunityId", opportunityIds[0]);
          }
          opportunityDisabled = false;
          opportunityLookupField.set(
            "v.opportuityLookupFieldFilter",
            "AccountId='" + id + "' and  (NOT StageName  like 'Closed%')"
          );
        }
        opportunityLookupField.set("v.disabled", opportunityDisabled);
      });
      $A.enqueueAction(action);
    } else {
      var opportunityLookupField = component.find("opportunityLookupField");
      opportunityLookupField.set("v.disabled", "true");
      component.set("v.opportunityId", "");
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
