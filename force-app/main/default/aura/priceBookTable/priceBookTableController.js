({
  recalculateTotal: function (component, event, helper) {
    var productAmount = event.getSource().get("v.value");
    var productName = event.getSource().get("v.id").split("_")[0];
    var tax = component.get("v.options.tax");
    var productPrice = document
      .getElementById(productName + "_price")
      .innerHTML.slice(0, -1);
    var total = parseFloat(productAmount) * parseFloat(productPrice);
    total = ((total / 100) * tax + total).toFixed(2);
    document.getElementById(productName + "_total").innerHTML =
      total + component.get("v.options.currency");
    productName = productName.split("::")[1];
    var currentProduct = component.get("v.options.entities").filter((obj) => {
      return obj.name == productName;
    })[0];
    currentProduct.amount = productAmount;
    currentProduct.total = total;
    $A.enqueueAction(component.get("c.recalculateSubtotalPrice"));
  },
  recalculateSubtotalPrice: function (component, event, helper) {
    var totalPrice = 0.0;
    component.get("v.options.entities").forEach((element) => {
      if (element.amount) {
        totalPrice += parseFloat(element.amount) * parseFloat(element.price);
      }
    });
    totalPrice = (
      totalPrice *
      (1 + parseFloat(component.get("v.options.tax") / 100))
    ).toFixed(2);
    var subtotals = component.get("v.subtotals");
    subtotals[component.get("v.options.pricebookName")] = totalPrice;
    component.set("v.subtotals", subtotals);
    component.set("v.options.total", totalPrice);
  },

  promotionChanged: function (component, event, helper) {
    var promotion = component.get("v.promotion");
    var pricebook = component.get("v.options");
    pricebook["entities"].forEach((element) => {
      var promoMarkup = document.getElementById(
        pricebook.pricebookName + "::" + element.name + "_price"
      );
      if (promotion.productList.includes(element.name)) {
        element.promoPrice = (
          element.price *
          (1 - promotion.discount / 100)
        ).toFixed(2);
        promoMarkup.style.color = "green";
      } else {
        element.promoPrice = element.price;
        promoMarkup.style.color = "black";
      }
      promoMarkup.innerHTML = element.promoPrice + pricebook.currency;
      document.getElementById(
        pricebook.pricebookName + "::" + element.name + "_total"
      ).innerHTML =
        element.promoPrice * element.amount * (1 + pricebook.tax / 100) +
        pricebook.currency;
    });
  },
});
