@isTest
private class CustomRestServiceTest{
	@isTest
	static void getListOfAccountAndContactIdsByCreationDate(){
		Account tempAccount = new Account(name = 'Test');
		Contact tempContact = new Contact(LastName = 'Test');

		insert tempAccount;
		insert tempContact;
		System.debug(String.valueOf(System.today()).removeEnd(' 00:00:00'));
		String testDate = String.valueOf(Date.today()).removeEnd(' 00:00:00');
		RestRequest request = new RestRequest();
		request.requestUri = 'https://resilient-bear-33i6xj-dev-ed.my.salesforce.com/services/apexrest/CustomRestService/'+testDate;
		request.httpMethod = 'GET';
		RestContext.request = request;


		String listAccountContactIds = CustomRestService.getAccountContactIds();
		System.assert(listAccountContactIds != null, 'empty ids list');
		System.assertEquals('{"contactsIds":["' + tempContact.Id + '"],"accountsIds":["' + tempAccount.Id + '"]}', listAccountContactIds, 'json with wrong params');
	}

	@isTest
	static void createAccountsAndContactsAndReturnListOfIds(){
		String jsonMsg = '{"accounts": [{"Name": "salesforce test 1"}],"contacts": [{"LastName": "Test lastname 1"}]}';
		RestRequest req = new RestRequest();
		RestResponse res = new RestResponse();
		req.requestURI = '/services/apexrest/CustomRestService';  //Request URL
		req.httpMethod = 'POST'; //HTTP Request Type
		req.requestBody = Blob.valueof(JsonMsg);
		RestContext.request = req;
		RestContext.response = res;
		String listAccountContactIds = CustomRestService.createAccountContact();
		System.assert(listAccountContactIds != null, 'empty ids list');
	}
}