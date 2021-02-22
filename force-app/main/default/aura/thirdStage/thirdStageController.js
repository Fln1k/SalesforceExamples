({
  init: function (component, event, helper) {
    if (component.get("v.productsOptions").length == 0) {
      var currencyCodes = { USD: "$", EUR: "€" };
      var action = component.get("c.getPricebookByAccountId");
      action.setParams({
        accountId: component.get("v.accountId"),
      });
      action.setCallback(this, function (response) {
        var groupBy = function (xs, objKey, key) {
          return xs.reduce(function (rv, x) {
            (rv[x[objKey][key]] = rv[x[objKey][key]] || []).push(x);
            return rv;
          }, {});
        };
        var result = JSON.parse(response.getReturnValue());
        result["pricebook"] = groupBy(
          result["pricebook"],
          "Product2",
          "Family"
        );
        var pricebook = [];
        var subtotals = {};
        var currencyIsoCode = " "
        component.set("v.shippingCountry", result["country"]);
        Object.keys(result["pricebook"]).forEach((pricebookId) => {
          var tempEntities = [];
          var pricebookIdentifier =
            result["pricebook"][pricebookId][0].Product2.Family;
          currencyIsoCode =
            result["pricebook"][pricebookId][0].CurrencyIsoCode;
          result["pricebook"][pricebookId].forEach((element) => {
            tempEntities.push({
              entitiyId: element.Id,
              name: element.Product2.Name,
              price: element.UnitPrice,
            });
          });
          subtotals[pricebookIdentifier] = 0;
          pricebook.push({
            pricebookName: pricebookIdentifier,
            entities: tempEntities,
            currency: currencyCodes[currencyIsoCode],
            total: 0,
            tax: result["tax"],
          });
        });
        component.set("v.currencyIsoCode", currencyIsoCode)
        component.set("v.subtotals", subtotals);
        component.set("v.productsOptions", pricebook);
      });
      $A.enqueueAction(action);
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
  }
});