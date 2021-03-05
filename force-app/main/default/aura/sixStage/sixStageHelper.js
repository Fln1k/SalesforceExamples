({
    createQuote : function(component,totalTax,productsToInsert) {
        var createQuote = component.get("c.createQuote");
        createQuote.setParams({
          quote: {
            OpportunityId: component.get("v.opportunityId"),
            BillingStreet: component.get("v.billingStreet"),
            BillingCity: component.get("v.billingCity"),
            BillingCountry: component.get("v.billingCountry"),
            BillingPostalCode: component.get("v.billingPostalCode"),
            BillingState: component.get("v.billingProvince"),
            ShippingCountry: component.get("v.shippingCountry"),
            ShippingStreet: component.get("v.shippingStreet"),
            ShippingCity: component.get("v.shippingCity"),
            ShippingPostalCode: component.get("v.shippingPostalCode"),
            ShippingState: component.get("v.shippingProvince"),
            CurrencyIsoCode: component.get("v.currencyIsoCode"),
            Tax: totalTax.toFixed(2),
          },
          opportunityLineItemsJson: JSON.stringify(productsToInsert),
          pricebookId: component.get("v.pricebookId"),
          contactId: component.get("v.contactId")
        });
        createQuote.setCallback(this, function (response) {
          var result = response.getReturnValue();
          component.set("v.quoteId", result.Id);
        });
        $A.enqueueAction(createQuote);
    }
})