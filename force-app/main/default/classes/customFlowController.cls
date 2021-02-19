public with sharing class customFlowController{
	@AuraEnabled
	public static Account createAccount(String name, String country){
		Account acc = new Account();
		acc.Name = name;
		acc.ShippingCountry = country;
		insert acc;
		return acc;
	}

	@AuraEnabled
	public static Contact createContact(String name, String accountId){
		Account currentAccount = [Select ShippingCountry
		                          from Account
		                          WHERE Id = :accountId];
		CountrySetting__c countrySetting = [Select Pricebook__c, Tax__c
		                                    from CountrySetting__c
		                                    WHERE Name = :currentAccount.ShippingCountry
		                                    LIMIT 1];
		PricebookEntry pricebookEntry = [SELECT CurrencyIsoCode
		                                 FROM PricebookEntry
		                                 WHERE Pricebook2Id = :countrySetting.Pricebook__c
		                                 LIMIT 1];
		Contact con = new Contact();
		con.LastName = name;
		con.AccountId = accountId;
		con.CurrencyIsoCode = pricebookEntry.CurrencyIsoCode;
		insert con;
		return con;
	}

	@AuraEnabled
	public static Contact getContact(string contactId){
		return [SELECT Id, Email
		        from Contact
		        Where Id = :contactId
		        LIMIT 1];
	}

	@AuraEnabled
	public static Opportunity createOpportunity(String accountId){
		Integer postfix = getAccountOpportunities(accountId).size()+1;
		Account currentAccount = [Select ShippingCountry
		                          from Account
		                          WHERE Id = :accountId];
		CountrySetting__c countrySetting = [Select Pricebook__c, Tax__c
		                                    from CountrySetting__c
		                                    WHERE Name = :currentAccount.ShippingCountry
		                                    LIMIT 1];
		PricebookEntry pricebookEntry = [SELECT CurrencyIsoCode
		                                 FROM PricebookEntry
		                                 WHERE Pricebook2Id = :countrySetting.Pricebook__c
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
	public static List<Opportunity> getAccountOpportunities(string Id){
		return new List<Opportunity>([select Id, StageName
		                              from Opportunity
		                              where AccountId = :Id]);
	}

	@AuraEnabled
	public static List<Quote> getOpportunityQuote(string opportunityId){
		return new List<Quote>([SELECT Id, OpportunityId
		                        FROM Quote
		                        WHERE OpportunityId = :opportunityId
		                        ORDER BY lastmodifieddate DESC
		                        LIMIT 1]);
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

	@AuraEnabled
	public static String getPricebookByAccountId(String accountId){
		Account currentAccount = [Select ShippingCountry
		                          from Account
		                          WHERE Id = :accountId];
		CountrySetting__c countrySetting = [Select Pricebook__c, Tax__c
		                                    from CountrySetting__c
		                                    WHERE Name = :currentAccount.ShippingCountry
		                                    LIMIT 1];
		String pricebook = JSON.serialize([SELECT Id, Product2.Name, UnitPrice, Pricebook2.Name, CurrencyIsoCode, Product2.Family
		                                   FROM PricebookEntry
		                                   WHERE Pricebook2Id = :countrySetting.Pricebook__c]);
		return '{"pricebook":' + pricebook + ',"tax":' + countrySetting.Tax__c + ',"country":"' + currentAccount.ShippingCountry + '"}';
	}

	@AuraEnabled
	public static Contact updateContact(String contactId, String contactEmail){
		Contact currentContact = [Select Email
		                          from Contact
		                          WHERE Id = :contactId
		                          LIMIT 1];
		currentContact.Email = contactEmail;
		update currentContact;
		return currentContact;
	}

	@AuraEnabled
	public static Account updateAccount(String accountId, String billingCountry, String billingCity, String billingStreet, String billingPostalCode, String billingProvince, String shippingStreet, String shippingCity, String shippingCountry, String shippingPostalCode, String shippingProvince){
		Account currentAccount = [Select BillingCountry, BillingCity, BillingStreet, BillingPostalCode, BillingState, ShippingStreet, ShippingCity, ShippingPostalCode, ShippingState
		                          from Account
		                          WHERE Id = :accountId];
		currentAccount.BillingCountry = billingCountry;
		currentAccount.BillingCity = billingCity;
		currentAccount.BillingStreet = billingStreet;
		currentAccount.BillingPostalCode = billingPostalCode;
		currentAccount.BillingState = billingProvince;
		currentAccount.ShippingStreet = shippingStreet;
		currentAccount.ShippingCity = shippingCity;
		currentAccount.ShippingPostalCode = shippingPostalCode;
		currentAccount.ShippingState = shippingProvince;
		update currentAccount;
		return currentAccount;
	}

	@AuraEnabled
	public static Account getCurrentAccountInfo(String accountId){
		Account currentAccount = [Select BillingCountry, BillingCity, BillingStreet, BillingPostalCode, BillingState, ShippingCountry, ShippingStreet, ShippingCity, ShippingPostalCode, ShippingState
		                          from Account
		                          WHERE Id = :accountId];

		return currentAccount;
	}

	@AuraEnabled
	public static Quote createQuote(string opportunityId, String billingCountry, String billingCity, String billingStreet, String billingPostalCode, String billingProvince, String shippingStreet, String shippingCity, String shippingCountry, String shippingPostalCode, String shippingProvince, String currencyIsoCode, String opportunityLineItemsJson){
		List<CustomOpportunityLineItem> customLineItems = CustomOpportunityLineItem.parse(opportunityLineItemsJson);
		Integer QuotesAmount = (new List<Quote>([select Id
		                                         from Quote
		                                         where opportunityId = :opportunityId])).size()+1;
		PricebookEntry pricebookEntry = [SELECT Pricebook2.Id, currencyIsoCode
		                                 FROM PricebookEntry
		                                 WHERE id = :customLineItems[0].pricebookEntryId];
		CountrySetting__c countrySetting = [SELECT Tax__c
		                                    from CountrySetting__c
		                                    WHERE Pricebook__c = :pricebookEntry.Pricebook2.id];
		Quote newQuote = new Quote();
		newQuote.name = 'Quote ' + QuotesAmount;
		newQuote.opportunityId = opportunityId;
		newQuote.BillingCountry = billingCountry;
		newQuote.BillingCity = billingCity;
		newQuote.BillingStreet = billingStreet;
		newQuote.BillingPostalCode = billingPostalCode;
		newQuote.BillingState = billingProvince;
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

	@AuraEnabled
	public static void closeOpportunity(string opportunityId){
		Opportunity opp = [SELECT Id
		                   FROM Opportunity
		                   WHERE Id = :opportunityId
		                   LIMIT 1];
		opp.StageName = 'Closed Won';
		update opp;
	}
}