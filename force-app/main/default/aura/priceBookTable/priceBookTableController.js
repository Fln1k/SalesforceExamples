({
  recalculateTotal: function (component, event, helper) {
    var productAmount = event.getSource().get("v.value");
    var productName = event.getSource().get("v.id").split("_")[0];
    var productPrice = document
      .getElementById(productName + "_price")
      .innerHTML.slice(0, -1);
    var subTotal = parseFloat(productAmount) * parseFloat(productPrice);
    document.getElementById(productName + "_total").innerHTML =
      subTotal.toFixed(2) + component.get("v.options.total");
    productName = productName.split("::")[1];
    component.get("v.options.entities").filter((obj) => {
      return obj.name == productName;
    })[0].amount = productAmount;
    $A.enqueueAction(component.get("c.recalculateSubtotalPrice"));
  },
  recalculateSubtotalPrice: function (component, event, helper) {
    var totalPrice = 0.0;
    component.get("v.options.entities").forEach((element) => {
      if (element.amount) {
        totalPrice += parseFloat(element.amount) * parseFloat(element.price);
      }
    });
    component.set("v.options.total", totalPrice.toFixed(2));
  },
});
