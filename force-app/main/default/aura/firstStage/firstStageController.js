({
  newRecord: function (component, event, helper) {
    $A.get("e.c:addNewAccount").fire();
  },
  handleAssignLookupId: function (component, event, helper) {
    var id = event.getParam("id");
    var object = event.getParam("object").toLowerCase();
    component.find(object + "LookupField").set("v.value", id);
    if (object == "account") {
      var action = component.get("c.getCountOfAccountOpportunities");
      action.setParams({
        Id: id,
      });
      action.setCallback(this, function (response) {
        var opportunitiesCount = response.getReturnValue();
        var opportunityDisabled;
        if (!parseInt(opportunitiesCount)) {
          opportunityDisabled = true;
        } else {
          opportunityDisabled = false;
          component
        .find("opportunityLookupField")
        .set("v.filter", "AccountId='" + id + "'");
        }
        component
          .find("opportunityLookupField")
          .set("v.disabled", opportunityDisabled);
      });
      $A.enqueueAction(action);
    }
  },
  handleShowNewAccount: function (component) {
    $A.createComponent("c:newAccount", {}, function (content, status) {
      if (status === "SUCCESS") {
        var modalBody = content;
        component
          .find("newAccountOverlay")
          .showCustomModal({
            header: "New Account",
            body: modalBody,
            showCloseButton: true,
            closeCallback: function (ovl) {
            },
          })
          .then(function (overlay) {
          });
      }
    });
  },
  handleRemoveAccountRecord: function (component, event, helper) {
    var opportunityLookupField = component.find("opportunityLookupField");
    opportunityLookupField.set('v.disabled', "true");
    opportunityLookupField.set('v.value', '');
  },
});
