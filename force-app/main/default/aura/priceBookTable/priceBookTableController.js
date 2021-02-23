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
    console.log(component.get("v.options.pricebookName"));
    subtotals[component.get("v.options.pricebookName")] = totalPrice;
    component.set("v.subtotals", subtotals);
    //HERE IS ERROR OCCURED
    component.set("v.options.total", totalPrice);
    //////////////////
  },
});
