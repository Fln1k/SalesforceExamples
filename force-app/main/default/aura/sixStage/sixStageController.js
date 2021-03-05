({
  getDocLink: function (component, event, helper) {
    var quoteId = component.get("v.quoteId");
    component.set("v.isSpinner", true);
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
        component.set("v.isSpinner", false);
      });
      $A.enqueueAction(getDocument);
    } else {
      var productsToInsert = [];
      var pricebooks = component.get("v.productsOptions");
      var totalTax = 0;
      var tax = component.get("v.tax");
      Object.keys(pricebooks).forEach((productFamily) => {
        pricebooks[productFamily]["entities"].forEach((product) => {
          if (parseInt(product.amount)) {
            productsToInsert.push({
              name: product.name,
              amount: product.amount,
              pricebookEntryId: product.entitiyId,
              price: product.promoPrice,
            });
            totalTax += (product.promoPrice * product.amount * tax) / 100;
          }
        });
      });
      helper.createQuote(component,totalTax,productsToInsert)
    }
  },
});
