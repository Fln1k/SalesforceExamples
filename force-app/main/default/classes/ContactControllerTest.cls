@isTest
private class ContactControllerTest{
	@testSetup
	static void setup(){
		Account testAccount = new Account(Name = 'Test');
		insert testAccount;
		Contact contact = new Contact(LastName = 'Test', AccountId = testAccount.Id, Email = 'testContactEmail@example.com');
		insert contact;
	}

	@isTest
	static void createContactTest(){
		Account account = [SELECT Id
		                   FROM Account
		                   LIMIT 1];

		String name = 'Test1';
		String accountId = account.Id;

		Contact contact = ContactController.createContact(name, accountId);
		System.assertEquals(name, contact.LastName, 'Contact name doesn\'t matches');
		System.assertEquals(accountId, contact.AccountId, 'Contact AccountId doesn\'t matches');
	}

	@isTest
	static void getContactTest(){
		Contact contact = [SELECT Id, Email
		                   FROM Contact
		                   LIMIT 1];
		Contact testedContact = ContactController.getContact(contact.Id);

		System.assertEquals(contact.Email, testedContact.Email, 'Contact email doesn\'t matches');
	}

	@isTest
	static void updateContactTest(){
		Contact contact = [SELECT Id, Email
		                   FROM Contact
		                   LIMIT 1];

		String newEmail = 'newTestContactEmail@example.com';

		Contact testedContact = ContactController.updateContact(contact.Id, newEmail);

		System.assertEquals(newEmail, testedContact.Email, 'Contact email doesn\'t changed');
	}
}