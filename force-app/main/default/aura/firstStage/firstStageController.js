({
  handleAssignAccountId: function (component, event, helper) {
    component.set("v.accountId", event.getParam("id"));
  },
  handleErrorMessageOnAccountLookup: function (component, event, helper) {
    component.find("accountLookupField").set("v.error", true);
  },
  accountLookupFieldValueChange: function (component, event, helper) {
    var accountId = event.getParam("value");
    component.find("accountLookupField").set("v.error", false);
    if (accountId.length > 0) {
      helper.setupAccountInfo(component, accountId);
      helper.setupOpportunityInfo(component, accountId);
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
