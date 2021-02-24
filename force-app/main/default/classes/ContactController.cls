public with sharing class ContactController{
	@AuraEnabled
	public static Contact createContact(String name, String accountId){
		Contact con = new Contact();
		con.LastName = name;
		con.AccountId = accountId;
		insert con;
		return con;
	}

	@AuraEnabled
	public static Contact getContact(string contactId){
		return [SELECT Id, Email
		        FROM Contact
		        WHERE Id = :contactId
		        WITH security_enforced
		        LIMIT 1];
	}

	@AuraEnabled
	public static Contact updateContact(String contactId, String contactEmail){
		Contact currentContact = [SELECT Email
		                          FROM Contact
		                          WHERE Id = :contactId
		                          WITH security_enforced
		                          LIMIT 1];
		currentContact.Email = contactEmail;
		update currentContact;
		return currentContact;
	}
}