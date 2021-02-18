public with sharing class CustomQuoteDocumentController{
	public Quote quote{ get; set; }

	public List<QuoteLineItem> quoteLineItems{ get; set; }

	public CustomQuoteDocumentController(){
		Id quoteId = ApexPages.currentPage().getParameters().get('id').escapeHtml4();
		quote = [SELECT Id, Name, Subtotal, Tax, TotalPrice
		         FROM Quote
		         WHERE Id = :quoteId
		         WITH security_enforced];
		quoteLineItems = [SELECT Id, PricebookEntry.Product2.Name, Quantity, UnitPrice, TotalPrice
		                  FROM QuoteLineItem
		                  WHERE QuoteId = :quoteId
		                  WITH security_enforced];
	}
}