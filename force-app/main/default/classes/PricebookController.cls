public with sharing class PricebookController{
	@AuraEnabled
	public static String getPricebookByAccountId(String accountId){
		Account currentAccount = [Select ShippingCountry
		                          from Account
		                          WHERE Id = :accountId
		                          WITH security_enforced];
		CountrySetting__c countrySetting = [SELECT Pricebook__c, Tax__c
		                                    FROM CountrySetting__c
		                                    WHERE Name = :currentAccount.ShippingCountry
		                                    WITH security_enforced
		                                    LIMIT 1];
		String pricebookEntries = JSON.serialize([SELECT Id, Product2.Name, UnitPrice, Pricebook2.Name, CurrencyIsoCode, Product2.Family
		                                          FROM PricebookEntry
		                                          WHERE Pricebook2Id = :countrySetting.Pricebook__c
		                                          WITH security_enforced]);
		return '{"pricebook":' + pricebookEntries + ',"tax":' + countrySetting.Tax__c + 
				',"country":"' + currentAccount.ShippingCountry + '","pricebookId":"' + countrySetting.Pricebook__c + '"}';
	}

	@AuraEnabled
	public static String getQuoteEntries(String quoteId){
		String quoteLineItems = JSON.serialize([SELECT Id, Quantity, PricebookEntry.Product2.Name
		                                        FROM QuoteLineItem
		                                        WHERE QuoteId = :quoteId
		                                        WITH security_enforced]);
		return '{"entities":' + quoteLineItems + '}';
	}
}