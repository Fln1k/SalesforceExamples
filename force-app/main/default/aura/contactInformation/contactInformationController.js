({
  setUpContactFilter: function (component, event, helper) {
    var accountId = component.get("v.accountId");
    console.log("AccountId='" + accountId + "'");
    component.set("v.contactLookupFieldFilter", "");
  },
});
