({
  getDocLink: function (component, event, helper) {
    var quoteId = component.get("v.quoteId");
    component.set("v.IsSpinner", true);
    if (quoteId.length > 0) {
      var getDocument = component.get("c.generaeteQuotePDF");
      getDocument.setParams({
        quoteId: quoteId,
      });
      getDocument.setCallback(this, function (response) {
        var document = response.getReturnValue();
        var link =
          window.location.origin +
          "/servlet/servlet.FileDownload?file=" +
          document.Id;
        component.set("v.quoteDocumentLink", link);
        component.set("v.IsSpinner", false);
      });
      $A.enqueueAction(getDocument);
    } else {
      var productsToInsert = [];
      var pricebooks = component.get("v.productsOptions");
      Object.keys(pricebooks).forEach((productFamily) => {
        pricebooks[productFamily]["entities"].forEach((product) => {
          if (parseInt(product.amount)) {
            productsToInsert.push({
              name: product.name,
              amount: product.amount,
              pricebookEntryId: product.entitiyId,
              price: product.price,
            });
          }
        });
      });
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
        },
        opportunityLineItemsJson: JSON.stringify(productsToInsert),
        tax: component.get("v.tax"),
        pricebookId: component.get("v.pricebookId"),
      });
      createQuote.setCallback(this, function (response) {
        var result = response.getReturnValue();
        component.set("v.quoteId", result.Id);
      });
      $A.enqueueAction(createQuote);
    }
  },
});
