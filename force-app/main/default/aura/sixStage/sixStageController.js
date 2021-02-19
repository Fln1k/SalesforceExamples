({
  getDocLink: function (component, event, helper) {
    var quoteId = component.get("v.quoteId");
    component.set("v.IsSpinner", true);
    if (quoteId.length > 0) {
      var getDocument = component.get("c.generaeteQuotePDF");
      getDocument.setParams({
        quoteId: quoteId,
      });
      getDocument.setCallback(this, function (response) {
        var document = response.getReturnValue();
        var link =
          window.location.origin +
          "/servlet/servlet.FileDownload?file=" +
          document.Id;
        component.set("v.quoteDocumentLink", link);
        component.set("v.IsSpinner", false);
      });
      $A.enqueueAction(getDocument);
    }
  },
});
