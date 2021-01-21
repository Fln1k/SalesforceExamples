@RestResource(urlMapping = 
'/CustomRestService/*')
global with sharing class CustomRestService{
	@HttpGet
	global static String getAccount(){
		List<Account> accountRecords = new List<Account>();
		List<Contact> contactRecords = new List<Contact>();
		RestRequest request = RestContext.request;

		DateTime dateToFind = DateTime.valueOf(request.requestURI.substring(request.requestURI.lastIndexOf('/')+1)+' 0:0:0').addHours(-8);

		System.Debug('>>request.date<<' + dateToFind);
		AccountContactWrapper result = new AccountContactWrapper();
		result.accounts = [SELECT Id
		                                  FROM Account
		                                  WHERE CreatedDate > :dateToFind and CreatedDate < :dateToFind.addDays(1)
		                                  WITH SECURITY_ENFORCED];

                                          result.contacts = [SELECT Id
		                                  FROM Contact
		                                  WHERE CreatedDate > :dateToFind and CreatedDate < :dateToFind.addDays(1)
		                                  WITH SECURITY_ENFORCED];

        return JSON.serialize(result.getIdsMap());
        
        /*
        https://resilient-bear-33i6xj-dev-ed.my.salesforce.com/services/apexrest/CustomRestService
        Json:
        {
            "accounts": [
                {
                "Name": "salesforce test 1"
                },
                {
                "Name": "salesforce test 2"
                }
            ],
            "contacts": [
                {
                "LastName": "Test lastname 1"
                },
                {
                "LastName": "Test lastname 2"
                }
            ]
        }

        */
	}

	@HttpPost
	global static String createAccount(){
		RestRequest request = RestContext.request;
		String stringJson = request.requestBody.tostring();
		AccountContactWrapper result = AccountContactWrapper.parse(stringJson);
		System.debug(result);
		try{
			insert result.accounts;
            insert result.contacts;
            return JSON.serialize(result.getIdsMap());
		} catch (Exception e){
            return 'error while insert contacts and accounts <<<<<< ' + e;
		}  

        /*
            https://resilient-bear-33i6xj-dev-ed.my.salesforce.com/services/apexrest/CustomRestService/2021-01-21
        */
	}
}