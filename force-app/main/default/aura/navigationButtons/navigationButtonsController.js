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
        console.log(productsToInsert);
      }
      if (currentStage == 5) {
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
        var updateAccountInfo = component.get(
          "c.updateAccountAndContactFields"
        );
        var createQote = component.get("c.createQuote");
        createQote.setParams({
          opportunityId: component.get("v.opportunityId"),
          billingStreet: component.get("v.billingStreet"),
          billingCity: component.get("v.billingCity"),
          billingCountry: component.get("v.billingCountry"),
          billingPostalCode: component.get("v.billingPostalCode"),
          billingProvince: component.get("v.billingProvince"),
          shippingStreet: component.get("v.shippingStreet"),
          shippingCity: component.get("v.shippingCity"),
          shippingCountry: component.get("v.shippingCountry"),
          shippingPostalCode: component.get("v.shippingPostalCode"),
          shippingProvince: component.get("v.shippingProvince"),
          opportunityLineItemsJson: JSON.stringify(productsToInsert),
          currencyIsoCode: component.get("v.currencyIsoCode"),
        });
        createQote.setCallback(this, function (response) {
          console.log(response.getReturnValue());
        });
        updateAccountInfo.setParams({
          accountId: component.get("v.accountId"),
          billingStreet: component.get("v.billingStreet"),
          billingCity: component.get("v.billingCity"),
          billingCountry: component.get("v.billingCountry"),
          billingPostalCode: component.get("v.billingPostalCode"),
          billingProvince: component.get("v.billingProvince"),
          shippingStreet: component.get("v.shippingStreet"),
          shippingCity: component.get("v.shippingCity"),
          shippingCountry: component.get("v.shippingCountry"),
          shippingPostalCode: component.get("v.shippingPostalCode"),
          shippingProvince: component.get("v.shippingProvince"),
        });
        updateAccountInfo.setCallback(this, function (response) {
          console.log(response.getReturnValue());
          $A.enqueueAction(createQote);
        });
        $A.enqueueAction(updateAccountInfo);
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
