({
  init: function (component, event, helper) {
    component.set("v.IsSpinner", true);
    if (component.get("v.productsOptions").length == 0) {
      var quoteId = component.get("v.quoteId");
      var quoteLineItems = {};
      if (quoteId.length) {
        helper.setupQuoteLineItems(component,quoteId,quoteLineItems)
      }
      helper.setupPricebook(component,quoteLineItems)
    } else {
      $A.enqueueAction(component.get("c.recalculateTotal"));
    }
  },
  recalculateTotal: function (component, event, helper) {
    var total = 0.0;
    var subtotals = component.get("v.subtotals");
    Object.keys(subtotals).forEach((pricebookName) => {
      total += parseFloat(subtotals[pricebookName]);
    });
    component.set("v.total", total.toFixed(2));
  },
  handleShowEmptyError: function (component, event, helper) {
    alert("select at least 1 product");
  },
});
