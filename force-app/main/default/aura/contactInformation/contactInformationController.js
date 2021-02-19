({
  showNewContact: function (component) {
    $A.createComponent(
      "c:newContact",
      { accountId: component.get("v.accountId") },
      function (content, status) {
        if (status === "SUCCESS") {
          var modalBody = content;
          component
            .find("newContactOverlay")
            .showCustomModal({
              header: "New Contact",
              body: modalBody,
              showCloseButton: true,
              closeCallback: function (ovl) {},
            })
            .then(function (overlay) {});
        }
      }
    );
  },
  handleAssignContactId: function (component, event, helper) {
    var contactId = event.getParam("id");
    component.find("contactLookupField").set("v.value", "");
    component.set("v.contactId", contactId);
  },

  handleContactChange: function (component, event, helper) {
    var contactId = component.get("v.contactId");
    if (contactId.length > 0) {
      var getContact = component.get("c.getContact");
      getContact.setParams({
        contactId: contactId,
      });
      getContact.setCallback(this, function (response) {
        var result = response.getReturnValue();
        component.set("v.contactEmail", result.Email);
        component.set("v.contactEmailFieldDisabled", false);
        component.find("emailInputField").showHelpMessageIfInvalid();
      });
      $A.enqueueAction(getContact);
    } else {
      component.set("v.contactEmail", "");
      component.set("v.contactEmailFieldDisabled", true);
      component.find("emailInputField").showHelpMessageIfInvalid();
    }
  },
  handleErrorCheck: function (component, event, helper) {
    if (component.get("v.contactId").length == 0) {
      component.find("contactLookupField").set("v.error", true);
    }
    if (component.get("v.contactEmail").length == 0) {
      component.find("emailInputField").showHelpMessageIfInvalid();
    }
  },
});
