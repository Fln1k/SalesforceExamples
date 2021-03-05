public with sharing class OpportunityController{
	@AuraEnabled
	public static Opportunity createOpportunity(String accountId){
		List<Opportunity> accountOpps = AccountController.getAccountOpportunities(accountId);
		Integer postfix = accountOpps.size()+1;
		String country = [Select ShippingCountry
		                  from Account
		                  WHERE Id = :accountId
		                  WITH security_enforced].ShippingCountry;
		String currencyIsoCode = [SELECT CurrencyIsoCode
		                          FROM CountrySetting__c
		                          WHERE Name = :country
		                          WITH security_enforced
		                          LIMIT 1].CurrencyIsoCode;
		String accountType = 'New';
		if (filter(accountOpps, 'StageName', 'Closed Won').size() > 0){
			accountType = 'Existing';
		}
		Opportunity newOpportunity = new Opportunity();
		newOpportunity.CurrencyIsoCode = currencyIsoCode;
		newOpportunity.CloseDate = date.today().addMonths(2);
		newOpportunity.Name = 'Opportunity ' + postfix;
		newOpportunity.StageName = 'Prospecting';
		newOpportunity.AccountId = accountId;
		newOpportunity.Customer_type__c = accountType;
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

	@AuraEnabled
	public static String getOpportunityDependencies(){
		String accountTypeString = 'Opportunity.Customer_type__c';
		String orderTypeString = 'Opportunity.Order_Type__c';
		String paymentPlanString = 'Opportunity.Payment_Plan__c';

		List<String> splitAccountTypeField = accountTypeString.split('\\.');
		Schema.SobjectField accountTypeField = Schema.getGlobalDescribe().get(splitAccountTypeField[0]).getDescribe().fields.getMap().get(splitAccountTypeField[1]);
		List<String> splitOrderTypeField = orderTypeString.split('\\.');
		Schema.SobjectField orderTypeField = Schema.getGlobalDescribe().get(splitOrderTypeField[0]).getDescribe().fields.getMap().get(splitOrderTypeField[1]);
		List<String> splitPaymentPlanField = paymentPlanString.split('\\.');
		Schema.SobjectField paymentPlanField = Schema.getGlobalDescribe().get(splitPaymentPlanField[0]).getDescribe().fields.getMap().get(splitPaymentPlanField[1]);

		String accountOrder = JSON.serialize(new DependentPicklists().controllingToDependentValues(accountTypeField, orderTypeField));
		String orderPayment = JSON.serialize(new DependentPicklists().controllingToDependentValues(orderTypeField, paymentPlanField));

		return '{"accountOrder":' + accountOrder + ',"orderPayment":' + orderPayment + '}';
	}

	private static List<Opportunity> filter(List<Opportunity> unfilteredOpps, String field, String value){
		List<Opportunity> filteredOpps = new List<Opportunity>();
		for (Opportunity opp : unfilteredOpps){
			if (opp.get(field) == value){
				filteredOpps.add(opp);
			}
		}
		return filteredOpps;
	}
}