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
        list<AggregateResult> opportunitiesCount = new list<AggregateResult>([select count(Id)cnt from Opportunity where AccountId=:Id]);
        return String.valueOf(opportunitiesCount[0].get('cnt')) ;
    }
}
