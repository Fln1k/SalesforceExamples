({
  newRecord: function (component, event, helper) {
    $A.get("e.c:addNewAccount").fire();
  },
  handleAssignAccountId: function (component, event, helper) {
    var id = event.getParam("id");
    console.log("id of created Account: "+id);
    component.find("accountLookupField").set("v.value", id);
  },
});
