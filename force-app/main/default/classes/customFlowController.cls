public with sharing class customFlowController {
    @AuraEnabled
    public static Account createAccount(String name, String country)    {
        Account acc = new Account();
        acc.Name = name;
        acc.BillingCountry = country;
        insert acc;
        return acc;
    }

    @AuraEnabled
    public static Opportunity createOpportunity(String accountId){
        Opportunity newOpportunity = new Opportunity();
        newOpportunity.CloseDate=date.today().addMonths(2);
        newOpportunity.Name='Opportunity for account '+accountId;
        newOpportunity.StageName='Prospecting';
        newOpportunity.AccountId = accountId;
        insert newOpportunity;
        return newOpportunity;
    }

    @AuraEnabled
    public static String getCountOfAccountOpportunities(string Id){
        return JSON.serialize((new Map<Id,Opportunity>([select Id from Opportunity where AccountId=:Id and (NOT StageName  like 'Closed%')])).keySet());
    }
}

