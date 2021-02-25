@isTest
private class AccountControllerTest{
	@testSetup
	static void setup(){
		List<Opportunity> testOpportunities = new List<Opportunity>();
		for (Integer accountCounter = 0; accountCounter < 2; accountCounter++){
			Account testAccount = new Account(Name = 'Test ' + accountCounter);
			insert testAccount;
			for (Integer opportunityCounter = 0; opportunityCounter < 2; opportunityCounter++){
				testOpportunities.add(new Opportunity(
                    Name = 'Opportunity ' + opportunityCounter, 
                    StageName = 'Prospecting', 
                    CurrencyIsoCode = 'USD', 
                    AccountId = testAccount.Id, 
                    CloseDate = date.today().addMonths(2)
                ));
			}
		}
		insert testOpportunities;
	}

	@isTest
	static void createAccountTest(){
		String name = 'Test1';
		String country = 'Belarus';

		Account account = AccountController.createAccount(name, country);
		System.assertEquals(name, account.name, 'Account name doesn\'t matches');
		System.assertEquals(country, account.ShippingCountry, 'Account country doesn\'t matches');
	}

	@isTest
	static void getAccountOpportunitiesTest(){
		Account account = [SELECT Id
		                   FROM Account
		                   LIMIT 1];

		List<Opportunity> opportunities = AccountController.getAccountOpportunities(account.Id);
		System.assertEquals(opportunities.size(), 2, 'Opportunities list size doesn\'t matches');
		for (Integer opportunityCounter = 0; opportunityCounter < 2; opportunityCounter++){
			System.assertEquals(
                'Opportunity ' + opportunityCounter, 
                opportunities.get(opportunityCounter).Name, 
                'Opportunities name doesn\'t matches'
            );
			System.assertEquals(
                account.id, 
                opportunities.get(opportunityCounter).AccountId, 
                'Opportunities AccountId doesn\'t matches'
            );
		}
	}

	@isTest
	static void getCurrentAccountInfoTest(){
		Account account = [SELECT Id
		                   FROM Account
		                   LIMIT 1];

		Map<String, String> accountParams = new Map<String, String>{
            'billingCountry' => 'Belarus',
            'billingCity' => 'Minsk',
            'billingStreet' => 'Puskina 12',
            'billingPostalCode' => '220053',
            'billingState' => '',
            'shippingCountry' => 'France',
            'shippingStreet' => 'Paris',
            'shippingCity' => 'Kolotushkina',
            'shippingPostalCode' => '220',
            'shippingState' => ''
        };
		account.BillingCountry = accountParams.get('billingCountry');
		account.BillingCity = accountParams.get('billingCity');
		account.BillingStreet = accountParams.get('billingStreet');
		account.BillingPostalCode = accountParams.get('billingPostalCode');
		account.BillingState = accountParams.get('billingState');
		account.ShippingCountry = accountParams.get('shippingCountry');
		account.ShippingStreet = accountParams.get('shippingStreet');
		account.ShippingCity = accountParams.get('shippingCity');
		account.ShippingPostalCode = accountParams.get('shippingPostalCode');
		account.ShippingState = accountParams.get('shippingState');

		update account;

		Account tempAccount = AccountController.getCurrentAccountInfo(account.Id);

		for (String paramName : accountParams.keySet()){
			System.assertEquals(
                accountParams.get(paramName), 
                account.get(paramName), 
                'Account ' + paramName + ' doesn\'t matches'
            );
		}
	}

	@isTest
	static void updateAccountTest(){
		Account account = [SELECT Id, Name
		                   FROM Account
		                   LIMIT 1];
		String newName = 'new test name';
		account.Name = newName;

		Account updatedAccount = AccountController.updateAccount(account);

		System.assertEquals(newName, updatedAccount.Name, 'Account newName doesn\'t changed');
	}
}