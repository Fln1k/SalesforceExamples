public with sharing class AccountController{
	@AuraEnabled
	public static Account createAccount(String name, String country){
		Account account = new Account();
		account.Name = name;
		account.ShippingCountry = country;
		insert account;
		return account;
	}

	@AuraEnabled
	public static List<Opportunity> getAccountOpportunities(string accountId){
		return new List<Opportunity>([select Id, StageName
		                              from Opportunity
		                              where AccountId = :accountId
		                              WITH security_enforced]);
	}

	@AuraEnabled
	public static Account getCurrentAccountInfo(String accountId){
		Account currentAccount = [SELECT BillingCountry, BillingCity, BillingStreet, BillingPostalCode, BillingState, ShippingCountry, ShippingStreet, ShippingCity, ShippingPostalCode, ShippingState
		                          FROM Account
		                          WHERE Id = :accountId
		                          WITH security_enforced];

		return currentAccount;
	}

	@AuraEnabled
	public static Account updateAccount(Account account){
		update account;
		return account;
	}

	@AuraEnabled
	public static String getAvailableCountries(){
		String stateString = 'Contact.MailingStateCode';
		String countryString = 'Contact.MailingCountryCode';

		List<String> splitStateString = stateString.split('\\.');
		Schema.SobjectField stateField = Schema.getGlobalDescribe().get(splitStateString[0]).getDescribe().fields.getMap().get(splitStateString[1]);
		List<String> splitCountryString = countryString.split('\\.');
		Schema.SobjectField countryField = Schema.getGlobalDescribe().get(splitCountryString[0]).getDescribe().fields.getMap().get(splitCountryString[1]);

		DependentPicklists dp = new DependentPicklists();

		Map<String, List<String>> dependency = dp.controllingToDependentValues(countryField, stateField);
		List<Schema.PicklistEntry> states = User.statecode.getDescribe().getPicklistValues();
		List<Schema.PicklistEntry> countries = User.Countrycode.getDescribe().getPicklistValues();

		return '{"countries":' + JSON.serialize(countries)+',"states":' + JSON.serialize(states)+',"dependency":' + JSON.serialize(dependency)+'}';
	}
}