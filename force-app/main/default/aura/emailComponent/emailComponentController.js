({
  init: function (component, event, helper) {
    var sendEmails = component.get("c.sendAssetsEmail");
    sendEmails.setParams({
      accountId: component.get("v.recordId"),
    });
    sendEmails.setCallback(this, function (response) {
      var result = response.getReturnValue();
      component.set("v.status",result);
    });
    $A.enqueueAction(sendEmails);
  },
});
