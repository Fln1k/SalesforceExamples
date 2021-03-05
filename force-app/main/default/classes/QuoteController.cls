public with sharing class QuoteController{
	@AuraEnabled
	public static Quote createQuote(Quote quote, String opportunityLineItemsJson, String pricebookId, String contactId){
		List<CustomOpportunityLineItem> customLineItems = CustomOpportunityLineItem.parse(opportunityLineItemsJson);
		Integer quotesAmount = (new List<Quote>([SELECT Id
		                                         FROM Quote
		                                         WHERE opportunityId = :quote.opportunityId
		                                         WITH security_enforced])).size()+1;

		OpportunityContactRole contactRole = new OpportunityContactRole(ContactId = contactId, OpportunityId = quote.opportunityId, Role = 'Maintainer');
		insert contactRole;

		quote.name = 'Quote ' + quotesAmount;
		quote.Pricebook2Id = pricebookId;
		insert quote;
		List<QuoteLineItem> quoteLineItems = new List<QuoteLineItem>();
		for (CustomOpportunityLineItem lineItem : customLineItems){
			QuoteLineItem tempQuoteLineItem = new QuoteLineItem();
			tempQuoteLineItem.QuoteId = quote.Id;
			tempQuoteLineItem.PricebookEntryId = lineItem.pricebookEntryId;
			tempQuoteLineItem.Quantity = lineItem.amount;
			tempQuoteLineItem.UnitPrice = lineItem.price;
			quoteLineItems.add(tempQuoteLineItem);
		}
		insert quoteLineItems;

		return quote;
	}

	@AuraEnabled
	public static QuoteDocument generaeteQuotePDF(string quoteId){
		String quoteUrl = '/apex/CustomQuoteDocument?';
		quoteUrl += 'id=' + quoteId;
		PageReference pageRef = new PageReference(quoteUrl);
		Blob quoteBlob;
		if (Test.isRunningTest()){
			quoteBlob = Blob.valueOf('Generate Pdf');
		} else{
			quoteBlob = pageRef.getContentAsPDF();
		}
		QuoteDocument quoteDoc = new QuoteDocument();
		quoteDoc.Document = quoteBlob;
		quoteDoc.QuoteId = quoteId;
		Database.insert(quoteDoc);
		return quoteDoc;
	}
}