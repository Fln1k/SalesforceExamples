({
  init: function (component, event, helper) {
    var productOptions = component.get("v.productsOptions");
    var productNames = [];
    if (productOptions.length > 0) {
      productOptions.forEach((pricebook) => {
        pricebook["entities"].forEach((product) => {
          productNames.push(product.name);
        });
      });
    }
    if (productNames.length > 0) {
      helper.getPromotions(component, productNames);
    }
  },
  handleClick: function (component, event, helper) {
    var selectedValue = event.getSource().get("v.value");
    var promotions = component.get("v.promotions");
    var isSelected = false;
    [].concat(component.find("promotionSelectButton")).forEach((button) => {
      if (button.get("v.value") != selectedValue) {
        button.set("v.variant", "brand-outline");
        button.set("v.label", "select");
      } else {
        if (button.get("v.variant") == "brand") {
          button.set("v.variant", "brand-outline");
          button.set("v.label", "select");
        } else {
          isSelected = true;
          button.set("v.variant", "brand");
          button.set("v.label", "selected");
          0;
          var promotion = promotions.filter((localPromotion) => {
            return localPromotion.name == selectedValue;
          })[0];
          component.set("v.selectedPromotion", promotion);
        }
      }
    });
    if (!isSelected) {
      component.set("v.selectedPromotion", {
        productList: [],
      });
    }
  },
});
