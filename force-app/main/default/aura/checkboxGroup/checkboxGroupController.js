({
  removeCheckedFromOtherBoxes: function (component, event, helper) {
    console.log("catch onchange selectbox");
    var selectedCheckboxValue = event.getSource().get("v.value");
    if( event.getSource().get("v.checked")){
      component.set("v.checkedValue", selectedCheckboxValue);
    }
    else{
      component.set("v.checkedValue", "");
    }
    component.find("checkbox").forEach(function (checkbox) {
      if (checkbox.get("v.value") != selectedCheckboxValue) {
        checkbox.set("v.checked", false);
      }
    });
  },
  disableCheckboxes: function (component, event, helper) {
    var disabledOptions = component.get("v.disabledOptions");
    component.find("checkbox").forEach(function (checkbox) {
      if (disabledOptions.includes(checkbox.get("v.value"))) {
        checkbox.set("v.disabled", true);
      } else {
        checkbox.set("v.disabled", false);
      }
      checkbox.set("v.checked", false);
    });
  },
});
