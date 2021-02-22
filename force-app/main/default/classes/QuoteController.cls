public with sharing class QuoteController {
    @AuraEnabled
	public static Quote createQuote(string opportunityId, String billingCountry, String billingCity, 
	String billingStreet, String billingPostalCode, String billingProvince, String shippingStreet, String shippingCity, 
	String shippingCountry, String shippingPostalCode, String shippingProvince, String currencyIsoCode, 
	String opportunityLineItemsJson){
		List<CustomOpportunityLineItem> customLineItems = CustomOpportunityLineItem.parse(opportunityLineItemsJson);
		Integer QuotesAmount = (new List<Quote>([SELECT Id
		                                         FROM Quote
		                                         WHERE opportunityId = :opportunityId
		                                         WITH security_enforced])).size()+1;
		PricebookEntry pricebookEntry = [SELECT Pricebook2.Id, currencyIsoCode
		                                 FROM PricebookEntry
		                                 WHERE id = :customLineItems[0].pricebookEntryId
		                                 WITH security_enforced];
		CountrySetting__c countrySetting = [SELECT Tax__c
		                                    FROM CountrySetting__c
		                                    WHERE Name = :shippingCountry
		                                    WITH security_enforced];

		Quote newQuote = new Quote();
		newQuote.name = 'Quote ' + QuotesAmount;
		newQuote.opportunityId = opportunityId;
		newQuote.BillingCountry = billingCountry;
		newQuote.BillingCity = billingCity;
		newQuote.BillingStreet = billingStreet;
		newQuote.BillingPostalCode = billingPostalCode;
		newQuote.BillingState = billingProvince;
		newQuote.ShippingCountry = shippingCountry;
		newQuote.ShippingStreet = shippingStreet;
		newQuote.ShippingCity = shippingCity;
		newQuote.ShippingPostalCode = shippingPostalCode;
		newQuote.ShippingState = shippingProvince;
		newQuote.CurrencyIsoCode = pricebookEntry.currencyIsoCode;
		newQuote.Pricebook2Id = pricebookEntry.Pricebook2.id;
		insert newQuote;

		List<QuoteLineItem> quoteLineItems = new List<QuoteLineItem>();
		Double totalPrice = 0.0;
		for (CustomOpportunityLineItem lineItem : customLineItems){
			QuoteLineItem tempQuoteLineItem = new QuoteLineItem();
			tempQuoteLineItem.QuoteId = newQuote.Id;
			tempQuoteLineItem.PricebookEntryId = lineItem.pricebookEntryId;
			tempQuoteLineItem.Quantity = lineItem.amount;
			tempQuoteLineItem.UnitPrice = lineItem.price;
			totalPrice += (lineItem.price * lineItem.amount);
			quoteLineItems.add(tempQuoteLineItem);
		}
		insert quoteLineItems;

		newQuote.Tax = totalPrice / 100 * countrySetting.Tax__c;
		update newQuote;

		return newQuote;
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
