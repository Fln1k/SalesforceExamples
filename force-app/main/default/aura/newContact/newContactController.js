({
  closeModal: function (component, event, helper) {
    component.find("newContactOverlay").notifyClose();
  },
  saveContact: function (component, event, helper) {
    var name = component.get("v.newContactNameField");
    var nameField = component.find("newContactField");
    nameField.showHelpMessageIfInvalid();
    var allValid = !nameField.get("v.validity").valueMissing;
    if (allValid) {
      var action = component.get("c.createContact");
      action.setParams({
        name: name,
        accountId: component.get("v.accountId"),
      });
      action.setCallback(this, function (response) {
        var assignLookupIdEvent = $A.get("e.c:assignContactId");
        assignLookupIdEvent.setParams({ id: response.getReturnValue().Id });
        assignLookupIdEvent.fire();
        component.set("v.newContactNameField", "");
        $A.enqueueAction(component.get("c.closeModal"));
      });
      $A.enqueueAction(action);
    }
  },
});
