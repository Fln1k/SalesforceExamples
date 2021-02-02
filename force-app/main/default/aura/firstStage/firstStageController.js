({
  newRecord: function (component, event, helper) {
    $A.get("e.c:addNewAccount").fire();
  },
  handleAssignAccountId: function (component, event, helper) {
    var id = event.getParam("id");
    console.log("id of created Account: " + id);
    component.find("accountLookupField").set("v.value", id);
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
              console.log("Overlay is closing");
            },
          })
          .then(function (overlay) {
            console.log("Overlay is made");
          });
      }
    });
  },
});
