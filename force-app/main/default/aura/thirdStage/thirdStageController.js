({
  init: function (component, event, helper) {
    if (component.get("v.productsOptions").length == 0) {
      var currencyCodes = { USD: "$", EUR: "€" };
      var quoteId = component.get("v.quoteId");
      var quoteLineItems;

      if (quoteId.length) {
        var getQuoteLineItems = component.get("c.getQuoteEntries");
        getQuoteLineItems.setParams({
          quoteId: quoteId,
        });
        getQuoteLineItems.setCallback(this, function (response) {
          component.set("v.quoteId", "");
          component.set("v.canMoveToEnd", "false");
          var result = JSON.parse(response.getReturnValue());
          var groupBy = function (xs, objKey, additionalObjKey, key) {
            return xs.reduce(function (rv, x) {
              (rv[x[objKey][additionalObjKey][key]] =
                rv[x[objKey][additionalObjKey][key]] || []).push(x);
              return rv;
            }, {});
          };
          quoteLineItems = groupBy(
            result["entities"],
            "PricebookEntry",
            "Product2",
            "Name"
          );
        });
        $A.enqueueAction(getQuoteLineItems);
      }
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
        var currencyIsoCode = " ";
        component.set("v.shippingCountry", result["country"]);
        Object.keys(result["pricebook"]).forEach((pricebookId) => {
          var tempEntities = [];
          var pricebookIdentifier =
            result["pricebook"][pricebookId][0].Product2.Family;
          currencyIsoCode = result["pricebook"][pricebookId][0].CurrencyIsoCode;
          var subTotal = 0.0;
          result["pricebook"][pricebookId].forEach((element) => {
            var amount = quoteLineItems[element.Product2.Name]
              ? quoteLineItems[element.Product2.Name][0]["Quantity"]
              : 0;
            var total = (
              parseFloat(amount) *
              parseFloat(element.UnitPrice) *
              (1 + parseFloat(result["tax"]) / 100)
            ).toFixed(2);
            tempEntities.push({
              entitiyId: element.Id,
              name: element.Product2.Name,
              price: element.UnitPrice,
              amount: amount,
              total: total,
            });
            subTotal += parseFloat(total);
          });
          subtotals[pricebookIdentifier] = subTotal;
          pricebook.push({
            pricebookName: pricebookIdentifier,
            entities: tempEntities,
            currency: currencyCodes[currencyIsoCode],
            total: subTotal,
            tax: result["tax"],
          });
        });
        component.set("v.currencyIsoCode", currencyIsoCode);
        component.set("v.subtotals", subtotals);
        console.log(pricebook);
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
  },
});
