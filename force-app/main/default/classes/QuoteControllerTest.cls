@isTest
private class QuoteControllerTest{
	@testSetup
	static void setup(){
		String defaultCurrencyIsoCode = 'USD';
		Decimal defaultProductPrice = 10.0;
		Id standardPricebookId = Test.getStandardPricebookId();
		Decimal defaultPruductsAmount = 1;

		Account testAccount = new Account(Name = 'Test account', ShippingCountry = 'France');
		insert testAccount;

		Opportunity newOpportunity = new Opportunity(Name = 'Test opp', StageName = 'Prospecting', AccountId = testAccount.Id, CloseDate = date.today().addMonths(2));
		insert newOpportunity;

		Product2 product = new Product2(Name = 'Football Manager 2021', Family = 'PC');
		insert product;

		PricebookEntry standardPrice = new PricebookEntry(Pricebook2Id = standardPricebookId, Product2Id = product.Id, UnitPrice = defaultProductPrice, IsActive = true);
		insert standardPrice;

		Pricebook2 pricebook = new Pricebook2(Name = 'Test pricebook', CurrencyIsoCode = defaultCurrencyIsoCode, IsActive = true);
		insert pricebook;

		PricebookEntry pricebookEntry = new PricebookEntry(IsActive = true, CurrencyIsoCode = defaultCurrencyIsoCode, UnitPrice = defaultProductPrice, Pricebook2Id = pricebook.Id, Product2Id = product.Id);
		insert pricebookEntry;

		Quote newQuote = new Quote(Name = 'Test quote', OpportunityId = newOpportunity.Id, Pricebook2Id = pricebook.Id);
		insert newQuote;

		QuoteLineItem quoteLineItem = new QuoteLineItem(QuoteId = newQuote.Id, PricebookEntryId = pricebookEntry.Id, Quantity = defaultPruductsAmount, UnitPrice = defaultProductPrice);
		insert quoteLineItem;

		CountrySetting__c countrySetting = new CountrySetting__c(Name = testAccount.ShippingCountry, CurrencyIsoCode = defaultCurrencyIsoCode, Pricebook__c = pricebook.Id);
		insert countrySetting;
	}

	@isTest
	static void createQuoteTest(){
		String defaultTax = '10';
		Id opportunityId = [SELECT Id, StageName
		                    FROM Opportunity
		                    LIMIT 1].Id;

		Id pricebookId = [SELECT Id
		                  FROM Pricebook2
		                  LIMIT 1].Id;

		Integer quotesAmount = (new List<Quote>([SELECT Id
		                                         FROM Quote
		                                         WHERE opportunityId = :opportunityId])).size()+1;

		List<PricebookEntry> pricebookEntries = [SELECT Id, Product2.Name, UnitPrice, Pricebook2Id
		                                         FROM PricebookEntry
		                                         WHERE Pricebook2Id = :pricebookId];
		List<CustomOpportunityLineItem> customOpportunityLineItems = new List<CustomOpportunityLineItem>();
		for (PricebookEntry entry : pricebookEntries){
			CustomOpportunityLineItem lineitem = new CustomOpportunityLineItem();
			lineitem.name = entry.Product2.Name;
			lineitem.amount = 1.0;
			lineitem.pricebookEntryId = entry.Id;
			lineitem.price = entry.UnitPrice;
			CustomOpportunityLineItems.add(lineitem);
		}

		String customOpportunityLineItemsJSON = JSON.serialize(customOpportunityLineItems);

		Quote newQuoteTemplate = new Quote();
		newQuoteTemplate.OpportunityId = opportunityId;

		Quote testedQuote = QuoteController.createQuote(newQuoteTemplate, customOpportunityLineItemsJSON, defaultTax, pricebookId);

		System.assertEquals('Quote ' + quotesAmount, testedQuote.name, 'Quote name doesn\'t matches');
		System.assertEquals(pricebookId, testedQuote.Pricebook2Id, 'Quote Pricebook2Id doesn\'t matches');
	}

	@isTest
	static void generaeteQuotePDFTest(){
		String quoteId = [SELECT Id
		                  FROM Quote
		                  LIMIT 1].Id;

		QuoteDocument testedQuoteDocument = QuoteController.generaeteQuotePDF(quoteId);

		System.assertEquals(quoteId, testedQuoteDocument.QuoteId, 'QuoteDocument quoteId doesn\'t matches');
	}
}