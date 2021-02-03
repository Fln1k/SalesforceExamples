public class customAccountController {
    @AuraEnabled
    public static Account createAccount(String name, String country)    {
        Account acc = new Account();
        acc.Name = name;
        acc.BillingCountry = country;
        insert acc;
        return acc;
    }

    @AuraEnabled
    public static String getCountOfAccountOpportunities(string Id){
        return JSON.serialize((new Map<Id,Opportunity>([select Id from Opportunity where AccountId=:Id and (NOT StageName  like 'Closed%')])).keySet());
    }
}
