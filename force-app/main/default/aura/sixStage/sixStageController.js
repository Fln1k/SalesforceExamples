({
  getDocLink: function (component, event, helper) {
    var quoteId = component.get("v.quoteId");
    component.set("v.IsSpinner", true);
    console.log(quoteId);
    console.log(quoteId.length);
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
      createQuote.setCallback(this, function (response) {
        var result = response.getReturnValue();
        component.set("v.quoteId", result.Id);
        console.log(result);
      });
      $A.enqueueAction(createQuote);
    }
  },
});
