({
  handleShowModal: function (component) {
    $A.createComponent("c:modal", {}, function (content, status) {
      if (status === "SUCCESS") {
        var modalBody = content;
        var cmp_1 = component.find("modalOverlay");
        cmp_1.showCustomModal({
          header: "Custom Flow",
          body: modalBody,
          showCloseButton: true,
          closeCallback: function (ovl) {
          },
        });
      }
    });
  },
});