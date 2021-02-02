({
  handleShowModal: function (component) {
    $A.createComponent("c:modal", {}, function (content, status) {
      console.log(content);
      console.log(status);
      if (status === "SUCCESS") {
        var modalBody = content;
        var cmp_1 = component.find("modalOverlay");
        cmp_1.showCustomModal({
          header: "Custom Flow",
          body: modalBody,
          showCloseButton: true,
          closeCallback: function (ovl) {
            console.log("Overlay is closing");
          },
        });
        console.log("CLICK CLACK");
      }
    });
  },
});
