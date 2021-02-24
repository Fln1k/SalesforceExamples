public with sharing class OpportunityController{
	@AuraEnabled
	public static Opportunity createOpportunity(String accountId){
		Integer postfix = AccountController.getAccountOpportunities(accountId).size()+1;
		Account currentAccount = [SELECT ShippingCountry
		                          FROM Account
		                          WHERE Id = :accountId
		                          WITH security_enforced];
		CountrySetting__c countrySetting = [SELECT Pricebook__c, Tax__c
		                                    FROM CountrySetting__c
		                                    WHERE Name = :currentAccount.ShippingCountry
		                                    WITH security_enforced
		                                    LIMIT 1];
		PricebookEntry pricebookEntry = [SELECT CurrencyIsoCode
		                                 FROM PricebookEntry
		                                 WHERE Pricebook2Id = :countrySetting.Pricebook__c
		                                 WITH security_enforced
		                                 LIMIT 1];
		Opportunity newOpportunity = new Opportunity();
		newOpportunity.CloseDate = date.today().addMonths(2);
		newOpportunity.Name = 'Opportunity ' + postfix;
		newOpportunity.StageName = 'Prospecting';
		newOpportunity.AccountId = accountId;
		newOpportunity.CurrencyIsoCode = pricebookEntry.CurrencyIsoCode;
		insert newOpportunity;
		return newOpportunity;
	}

	@AuraEnabled
	public static Id getOpportunityIdByQuoteId(string quoteId){
		return [SELECT Id, OpportunityId
		        FROM Quote
		        WHERE Id = :quoteId
		        WITH security_enforced
		        LIMIT 1].OpportunityId;
	}

	@AuraEnabled
	public static Quote getOpportunityQuote(string opportunityId){
		return [SELECT Id, OpportunityId
		        FROM Quote
		        WHERE OpportunityId = :opportunityId
		        WITH security_enforced
		        ORDER BY lastmodifieddate DESC
		        LIMIT 1];
	}

	@AuraEnabled
	public static Opportunity getOpportunityAccount(string opportunityId){
		return ([SELECT Id, AccountId
		         FROM Opportunity
		         WHERE Id = :opportunityId
		         WITH security_enforced
		         LIMIT 1]);
	}

	@AuraEnabled
	public static void closeOpportunity(string opportunityId, string quoteId){
		Opportunity opp = [SELECT Id
		                   FROM Opportunity
		                   WHERE Id = :opportunityId
		                   WITH security_enforced
		                   LIMIT 1];
		opp.StageName = 'Closed Won';
		opp.SyncedQuoteId = quoteId;
		update opp;
	}
}