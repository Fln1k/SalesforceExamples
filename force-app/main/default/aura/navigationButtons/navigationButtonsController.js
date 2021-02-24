({
  changeStageFunction: function (component, event, helper) {
    var valueToChange = parseInt(event.getSource().get("v.value"));
    var currentStage = parseInt(component.get("v.currentStage"));
    var isValid = true;
    if (valueToChange == 1) {
      if (currentStage == 1) {
        var accountId = component.get("v.accountId");
        if (!accountId.length) {
          isValid = false;
          $A.get("e.c:errorMessageOnAccountLookup").fire();
        } else {
          if (!component.get("v.opportunityId").length) {
            $A.get("e.c:createNewOpportunity").fire();
          }
          component.set("v.quoteId", "");
        }
      }
      if (currentStage == 2) {
        var paymentPlan = component.get("v.paymentPlan");
        if (!paymentPlan.length) {
          isValid = false;
          $A.get("e.c:paymentPlanUndefined").fire();
        }
      }
      if (currentStage == 3) {
        isValid = false;
        var pricebooks = component.get("v.productsOptions");
        Object.keys(pricebooks).forEach((productFamily) => {
          pricebooks[productFamily]["entities"].forEach((product) => {
            if (parseInt(product.amount)) {
              isValid = true;
            }
          });
        });
        if (!isValid) {
          $A.get("e.c:showEmptyProductListErrorMessage").fire();
        }
      }
      if (currentStage == 5) {
        var variables = {
          accountId: component.get("v.accountId"),
          opportunityId: component.get("v.opportunityId"),
          billingStreet: component.get("v.billingStreet"),
          billingCity: component.get("v.billingCity"),
          billingCountry: component.get("v.billingCountry"),
          billingPostalCode: component.get("v.billingPostalCode"),
          shippingStreet: component.get("v.shippingStreet"),
          shippingCity: component.get("v.shippingCity"),
          shippingCountry: component.get("v.shippingCountry"),
          shippingPostalCode: component.get("v.shippingPostalCode"),
          currencyIsoCode: component.get("v.currencyIsoCode"),
          contactId: component.get("v.contactId"),
          contactEmail: component.get("v.contactEmail"),
        };
        Object.keys(variables).forEach((attribute) => {
          if (variables[attribute].length == 0) {
            isValid = false;
          }
        });
        if (isValid) {
          $A.get("e.c:updateAccountInformation").fire();
          $A.get("e.c:updateContactInformation").fire();
        } else {
          $A.get("e.c:checkValidationOnTheFifthStage").fire();
        }
      }
    }
    if (isValid) {
      var valueToAssign = currentStage + valueToChange;
      setTimeout(function request() {
        component.set("v.currentStage", valueToAssign);
      }, 1000);
    }
  },
  closeModalFunction: function (component, event, helper) {
    component.getEvent("closeModalEvent").fire();
  },
});
