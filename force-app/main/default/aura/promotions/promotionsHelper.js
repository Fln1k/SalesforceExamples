({
  getPromotions: function (component, productNames) {
    var getPromotions = component.get("c.getPromotions");
    getPromotions.setParams({
      paymentPlan: component.get("v.paymentPlan"),
      productNames: productNames,
      accountId: component.get("v.accountId"),
    });
    getPromotions.setCallback(this, function (response) {
      var promotions = [];
      var result = JSON.parse(response.getReturnValue())["entities"];
      var groupBy = function (xs, key) {
        return xs.reduce(function (rv, x) {
          (rv[x[key]] = rv[x[key]] || []).push(x);
          return rv;
        }, {});
      };
      var groupedResult = groupBy(result, "Promotion__c");
      Object.keys(groupedResult).forEach((promotionId) => {
        var promotionItems = [];
        groupedResult[promotionId].forEach((product) => {
          promotionItems.push(product.Product__r.Name);
        });
        promotions.push({
          name: groupedResult[promotionId][0].Promotion__r.Name,
          discount: groupedResult[promotionId][0].Promotion__r.Discount__c,
          endDate: groupedResult[promotionId][0].Promotion__r.EndDate__c,
          productList: promotionItems,
        });
      });
      component.set("v.promotionsSize", promotions.length);
      component.set("v.promotions", promotions);
    });
    $A.enqueueAction(getPromotions);
  },
});
