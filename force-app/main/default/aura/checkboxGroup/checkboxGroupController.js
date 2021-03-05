({
  checkboxOnChange: function (component, event, helper) {
    var selectedCheckboxValue = event.getSource().get("v.value");
    component.find("checkbox").forEach(function (checkbox) {
      if (checkbox.get("v.value") != selectedCheckboxValue) {
        checkbox.set("v.checked", false);
      }
      $A.util.removeClass(checkbox, "slds-has-error");
      component.set("v.isError", false);
    });
    if (event.getSource().get("v.checked")) {
      component.set("v.value", selectedCheckboxValue);
    } else {
      component.set("v.value", "");
      $A.enqueueAction(component.get("c.showError"));
    }
  },
  prepareCheckboxes: function (component, event, helper) {
    var enabledOptions = component.get("v.enabledOptions");
    if (enabledOptions.length) {
      component.find("checkbox").forEach(function (checkbox) {
        if (enabledOptions.includes(checkbox.get("v.value"))) {
          checkbox.set("v.disabled", false);
        } else {
          checkbox.set("v.disabled", true);
        }
      });
    }
  },
  enableCheckboxes: function (component, event, helper) {
    var enabledOptions = component.get("v.enabledOptions");
    if (enabledOptions.length) {
      component.find("checkbox").forEach(function (checkbox) {
        if (enabledOptions.includes(checkbox.get("v.value"))) {
          checkbox.set("v.disabled", false);
        } else {
          checkbox.set("v.disabled", true);
        }
        checkbox.set("v.checked", false);
        component.set("v.value", "");
      });
    }
  },
  showError: function (component, event, helper) {
    component.find("checkbox").forEach(function (checkbox) {
      if (!checkbox.disabled) {
        $A.util.addClass(checkbox, "slds-has-error");
        component.set("v.isError", true);
      }
    });
  },
});
