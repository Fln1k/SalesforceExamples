({
  newRecord: function (component, event, helper) {
    component.getEvent("addNewAccountEvent").fire();
  },
});
