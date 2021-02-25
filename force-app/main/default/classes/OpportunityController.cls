public with sharing class OpportunityController{
	@AuraEnabled
	public static Opportunity createOpportunity(String accountId){
		Integer postfix = AccountController.getAccountOpportunities(accountId).size()+1;
		String country = [Select ShippingCountry
		                  from Account
		                  WHERE Id = :accountId
		                  WITH security_enforced].ShippingCountry;
		String currencyIsoCode = [SELECT CurrencyIsoCode
		                          FROM CountrySetting__c
		                          WHERE Name = :country
		                          WITH security_enforced
		                          LIMIT 1].CurrencyIsoCode;
		Opportunity newOpportunity = new Opportunity();
		newOpportunity.CurrencyIsoCode = currencyIsoCode;
		newOpportunity.CloseDate = date.today().addMonths(2);
		newOpportunity.Name = 'Opportunity ' + postfix;
		newOpportunity.StageName = 'Prospecting';
		newOpportunity.AccountId = accountId;
		insert newOpportunity;
		return newOpportunity;
	}

	@AuraEnabled
	public static Id getOpportunityIdByQuoteId(string quoteId){
		return [SELECT OpportunityId
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
	public static Opportunity getOpportunity(string opportunityId){
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