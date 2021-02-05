({
  removeCheckedFromOtherBoxes: function (component, event, helper) {
    var selectedCheckboxName = event.getSource().get("v.name");
    component.find("checkbox").forEach(function (checkbox) {
      if (checkbox.get("v.name") != selectedCheckboxName) {
        checkbox.set("v.checked", false);
      }
    });
  },
});
