public with sharing class AccountContactWrapper{
	public List<Account> accounts;
	public List<Contact> contacts;
	public static AccountContactWrapper parse(String json) {
		return (AccountContactWrapper)System.JSON.deserialize(json, AccountContactWrapper.class);
	}

	public Map<String, Set<Id>> getIdsMap() {
		Map<String, Set<Id>> result = new Map<String, Set<Id>>();
		result.put('accountsIds', (new Map<Id, Account>(this.accounts)).keySet());
		result.put('contactsIds', (new Map<Id, Contact>(this.contacts)).keySet());

		return result;
	}
}