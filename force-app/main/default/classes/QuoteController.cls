public with sharing class QuoteController{
	@AuraEnabled
	public static Quote createQuote(Quote quote, String opportunityLineItemsJson, String tax, String pricebookId){
		List<CustomOpportunityLineItem> customLineItems = CustomOpportunityLineItem.parse(opportunityLineItemsJson);
		Integer quotesAmount = (new List<Quote>([SELECT Id
		                                         FROM Quote
		                                         WHERE opportunityId = :quote.opportunityId
		                                         WITH security_enforced])).size()+1;

		quote.name = 'Quote ' + quotesAmount;
		quote.Pricebook2Id = pricebookId;
		insert quote;
		List<QuoteLineItem> quoteLineItems = new List<QuoteLineItem>();
		Double totalPrice = 0.0;
		for (CustomOpportunityLineItem lineItem : customLineItems){
			QuoteLineItem tempQuoteLineItem = new QuoteLineItem();
			tempQuoteLineItem.QuoteId = quote.Id;
			tempQuoteLineItem.PricebookEntryId = lineItem.pricebookEntryId;
			tempQuoteLineItem.Quantity = lineItem.amount;
			tempQuoteLineItem.UnitPrice = lineItem.price;
			totalPrice += (lineItem.price * lineItem.amount);
			quoteLineItems.add(tempQuoteLineItem);
			system.debug(tempQuoteLineItem.pricebookEntryId);
		}
		insert quoteLineItems;
		quote.Tax = totalPrice / 100 * decimal.valueOf(tax);
		update quote;

		return quote;
	}

	@AuraEnabled
	public static QuoteDocument generaeteQuotePDF(string quoteId){
		String quoteUrl = '/apex/CustomQuoteDocument?';
		String quoteTemplateId = Label.QuoteTemplateId;
		quoteUrl += 'id=' + quoteId;
		PageReference pageRef = new PageReference(quoteUrl);
		Blob quoteBlob;
		quoteBlob = pageRef.getContentAsPDF();
		QuoteDocument quoteDoc = new QuoteDocument();
		quoteDoc.Document = quoteBlob;
		quoteDoc.QuoteId = quoteId;
		Database.insert(quoteDoc);
		return quoteDoc;
	}
}