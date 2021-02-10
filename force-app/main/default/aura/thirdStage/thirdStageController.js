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
        result["pricebooks"] = groupBy(result["pricebooks"], "Pricebook2Id");
        console.log(result);
        var pricebook = [];
        Object.keys(result["pricebooks"]).forEach((pricebookId) => {
          var tempEntities = [];
          var pricebookName = result["pricebooks"][pricebookId][0].Pricebook2.Name;
          var currencyIsoCode = result["pricebooks"][pricebookId][0].CurrencyIsoCode;
          result["pricebooks"][pricebookId].forEach((element) => {
            tempEntities.push({
              name: element.Product2.Name,
              price: element.UnitPrice,
            });
          });
          console.log(result["taxes"][0][pricebookId]);
          pricebook.push({
            pricebookName: pricebookName,
            entities: tempEntities,
            currency:currencyCodes[currencyIsoCode],
            total: 0,
            tax: result["taxes"][0][pricebookId]
          });
        });
        console.log(pricebook)
        component.set("v.productsOptions", pricebook);
      });
      $A.enqueueAction(action);
    }
  },
  recalculateTotal: function (component, event, helper) {
    console.log("catch recalculate");
    var total = 0.0;
    component.get("v.productsOptions").forEach((pricebook) => {
      total += parseFloat(pricebook.total);
    });
    component.set("v.total", total);
  },
});
