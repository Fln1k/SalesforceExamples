@isTest
private class OpportunityControllerTest{
	@testSetup
	static void setup(){
		Account testAccount = new Account(Name = 'Test', ShippingCountry = 'France');
		insert testAccount;
		CountrySetting__c countrySetting = new CountrySetting__c(Name = testAccount.ShippingCountry, CurrencyIsoCode = 'EUR');
		insert countrySetting;
		Opportunity newOpportunity = new Opportunity(Name = 'Test', StageName = 'Prospecting', AccountId = testAccount.Id, CloseDate = date.today().addMonths(2));
		insert newOpportunity;
		Quote newQuote = new Quote(Name = 'Test', OpportunityId = newOpportunity.Id);
		insert newQuote;
	}

	@isTest
	static void createOpportunityTest(){
		Account account = [SELECT Id, ShippingCountry
		                   FROM Account
		                   LIMIT 1];

		String currencyIsoCode = [SELECT CurrencyIsoCode
		                          FROM CountrySetting__c
		                          WHERE Name = :account.ShippingCountry
		                          WITH security_enforced
		                          LIMIT 1].CurrencyIsoCode;

		Integer accountOpportunityAmount = [SELECT Id, AccountId
		                                    FROM Opportunity
		                                    WHERE AccountId = :account.Id].size();
		Opportunity opportunity = OpportunityController.createOpportunity(account.Id);
		System.assertEquals('Opportunity ' + (accountOpportunityAmount + 1), opportunity.Name, 'Opportunity name doesn\'t matches');
		System.assertEquals(currencyIsoCode, opportunity.CurrencyIsoCode, 'Opportunity CurrencyIsoCode doesn\'t matches');
		System.assertEquals(account.Id, opportunity.AccountId, 'Opportunity AccountId doesn\'t matches');
		System.assertEquals('Prospecting', opportunity.StageName, 'Opportunity StageName doesn\'t matches');
		System.assertEquals(date.today().addMonths(2), opportunity.CloseDate, 'Opportunity CloseDate doesn\'t matches');
	}

	@isTest
	static void closeOpportunityTest(){
		Opportunity opportunity = [SELECT Id, StageName
		                           FROM Opportunity
		                           LIMIT 1];
		Quote quote = [SELECT Id
		               FROM Quote
		               LIMIT 1];

		OpportunityController.closeOpportunity(opportunity.Id, quote.Id);

		Opportunity closedOpportunity = [SELECT Id, StageName
		                                 FROM Opportunity
		                                 LIMIT 1];

		System.assertEquals('Closed Won', closedOpportunity.StageName, 'Opportunity stage doesn\'t matches');
	}

	@isTest
	static void getOpportunityTest(){
		Opportunity opportunity = [SELECT Id
		                           FROM Opportunity
		                           LIMIT 1];

		Account account = [SELECT Id, ShippingCountry
		                   FROM Account
		                   LIMIT 1];

		Opportunity testedOpportunity = OpportunityController.getOpportunity(opportunity.Id);
		System.assertEquals(account.Id, testedOpportunity.AccountId, 'Opportunity Id doesn\'t matches');
	}

	@isTest
	static void getOpportunityIdByQuoteIdTest(){
		Id quoteId = [SELECT Id
		              FROM Quote
		              LIMIT 1].Id;

		Opportunity opportunity = [SELECT Id
		                           FROM Opportunity
		                           LIMIT 1];

		Id opportunityId = OpportunityController.getOpportunityIdByQuoteId(quoteId);
		System.assertEquals(opportunity.Id, opportunityId, 'Opportunity Id doesn\'t matches');
	}

	@isTest
	static void getOpportunityQuoteTest(){
		Id quoteId = [SELECT Id
		              FROM Quote
		              LIMIT 1].Id;

		Id opportunityId = [SELECT Id
		                    FROM Opportunity
		                    LIMIT 1].Id;

		Quote opportunityQuote = OpportunityController.getOpportunityQuote(opportunityId);
		System.assertEquals(opportunityQuote.Id, quoteId, 'Quote Id doesn\'t matches');
		System.assertEquals(opportunityQuote.OpportunityId, opportunityId, 'Quote OpportunityId doesn\'t matches');
	}
}