public with sharing class AccountContactWrapper{
	public List<Account> accounts;
	public List<Contact> contacts;
	
	public static AccountContactWrapper parse(String json) {
		return (AccountContactWrapper) System.JSON.deserialize(json, AccountContactWrapper.class);
	}

	public Map<String,List<Id>> getIdsMap(){
		List<Id> accountIds = new List<Id>();
		List<Id> contactIds = new List<Id>();
		Map<String,List<Id>> result = new Map<String,List<Id>>();

        for(Account tempAccount: this.accounts){
            accountIds.add(tempAccount.Id);
		}
		result.put('accountsIds', accountIds);

        for(Contact tempContact: this.contacts){
            contactIds.add(tempContact.Id);
		}
		result.put('contactsIds', contactIds);

		return result;
	}
}