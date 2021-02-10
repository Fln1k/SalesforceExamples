({
  init: function (component, event, helper) {
    if (component.get("v.productsOptions").length == 0) {
      var currencyCodes = { USD: "$", EUR: "€" };
      var action = component.get("c.getPricebookByAccountId");
      action.setParams({
        accountId: component.get("v.accountId"),
      });
      action.setCallback(this, function (response) {
        var groupBy = function (xs, key) {
          return xs.reduce(function (rv, x) {
            (rv[x[key]] = rv[x[key]] || []).push(x);
            return rv;
          }, {});
        };
        var result = JSON.parse(response.getReturnValue());
        result = groupBy(result, "Pricebook2Id");
        var pricebook = [];
        Object.keys(result).forEach((pricebookId) => {
          var tempEntities = [];
          var pricebookName = result[pricebookId][0].Pricebook2.Name;
          var currencyIsoCode = result[pricebookId][0].CurrencyIsoCode;
          result[pricebookId].forEach((element) => {
            tempEntities.push({
              name: element.Product2.Name,
              price: element.UnitPrice,
            });
          });
          pricebook.push({
            pricebookName: pricebookName,
            entities: tempEntities,
            currency:currencyCodes[currencyIsoCode],
            total: 0,
          });
        });
        component.set("v.productsOptions", pricebook);
      });
      $A.enqueueAction(action);
    }
  },
  recalculateTotal: function (component, event, helper) {
    console.log("catch recalculate total")
    var total = 0.0;
    component.get("v.productsOptions").forEach((pricebook) => {
      total += pricebook.total;
    });
    component.set("v.total", total);
  },
});
