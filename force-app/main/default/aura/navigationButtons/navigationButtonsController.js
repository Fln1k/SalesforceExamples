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
        }
        if (!component.get("v.opportunityId").length) {
          var action = component.get("c.createOpportunity");
          action.setParams({
            accountId: accountId,
          });
          action.setCallback(this, function (response) {
            var newOpportunityId = response.getReturnValue().Id;
            component.set("v.opportunityId", newOpportunityId);
          });
          $A.enqueueAction(action);
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
        var productsToInsert = [];
        var pricebooks = component.get("v.productsOptions");
        Object.keys(pricebooks).forEach((productFamily) => {
          pricebooks[productFamily]["entities"].forEach((product) => {
            if (parseInt(product.amount)) {
              isValid = true;
              productsToInsert.push({
                amount: product.amount,
                pricebookEntryId: product.entitiyId,
                price: product.price,
              });
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
          console.log("before account update");
          $A.get("e.c:updateAccountInformation").fire();
          console.log("after account update");
          console.log("before contact update");         
          $A.get("e.c:updateContactInformation").fire();
          console.log("after contact update");
        } else {
          console.log("something was wrong");
          $A.get("e.c:checkValidationOnTheFifthStage").fire();          
        }
      }
    }
    if (isValid) {
      var valueToAssign = currentStage + valueToChange;
      component.set("v.currentStage", valueToAssign);
    }
  },
  closeModalFunction: function (component, event, helper) {
    component.getEvent("closeModalEvent").fire();
  },
});
