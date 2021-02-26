@isTest
public class CustomQuoteDocumentControllerTest{
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
	static void CustomQuoteDocumentControllerTest(){
		Quote quote = [SELECT Id, Name, Subtotal, TotalPrice
		               FROM Quote
		               LIMIT 1];
		List<QuoteLineItem> quoteLineItems = [SELECT Id, PricebookEntry.Product2.Name, Quantity, UnitPrice, TotalPrice
		                                      FROM QuoteLineItem
		                                      WHERE QuoteId = :quote.Id];
		String quoteUrl = '/apex/CustomQuoteDocument?';
		quoteUrl += 'id=' + quote.Id;
		PageReference pageRef = new PageReference(quoteUrl);
		Test.setCurrentPage(pageRef);
		CustomQuoteDocumentController controller = new CustomQuoteDocumentController();

		Quote testedQuote = controller.quote;
		List<quoteLineItem> testedQuoteLineItems = controller.quoteLineItems;

		System.assertEquals(quote.Id, testedQuote.Id, 'Quote Id doesn\'t matches');
		System.assertEquals(quote.Name, testedQuote.Name, 'Quote Name doesn\'t matches');
		System.assertEquals(quote.Subtotal, testedQuote.Subtotal, 'Quote Subtotal doesn\'t matches');
		System.assertEquals(quote.TotalPrice, testedQuote.TotalPrice, 'Quote TotalPrice doesn\'t matches');
		for (Integer counter = 0; counter < testedQuoteLineItems.size();++counter){
			System.assertEquals(quoteLineItems[counter].Id, testedQuoteLineItems[counter].Id, 'quoteLineItem Id doesn\'t matches');
			System.assertEquals(quoteLineItems[counter].PricebookEntry.Product2.Name, testedQuoteLineItems[counter].PricebookEntry.Product2.Name, 'quoteLineItem Product2.Name doesn\'t matches');
			System.assertEquals(quoteLineItems[counter].Quantity, testedQuoteLineItems[counter].Quantity, 'quoteLineItem Quantity doesn\'t matches');
			System.assertEquals(quoteLineItems[counter].UnitPrice, testedQuoteLineItems[counter].UnitPrice, 'quoteLineItem UnitPrice doesn\'t matches');
			System.assertEquals(quoteLineItems[counter].TotalPrice, testedQuoteLineItems[counter].TotalPrice, 'quoteLineItem TotalPrice doesn\'t matches');
		}
	}
}