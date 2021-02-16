({
  setUpContactFilter: function (component, event, helper) {
    var accountId = component.get("v.accountId");
    console.log("AccountId='" + accountId + "'");
    component.set("v.contactLookupFieldFilter", "");
  },
  showNewContact: function (component) {
    console.log("catch show new contact");
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
    var getContact = component.get("c.getContact");
    getContact.setParams({
      contactId: contactId,
    });
    getContact.setCallback(this, function (response) {
      var result = response.getReturnValue();
      component.set("v.contactEmail",result.Email);
      
    });
    $A.enqueueAction(getContact);
  }
});
