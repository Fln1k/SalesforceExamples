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
        Integer postfix=getCountOfAccountOpportunities(accountId).size();
        Opportunity newOpportunity = new Opportunity();
        newOpportunity.CloseDate=date.today().addMonths(2);
        newOpportunity.Name='Opportunity '+postfix;
        newOpportunity.StageName='Prospecting';
        newOpportunity.AccountId = accountId;
        insert newOpportunity;
        return newOpportunity;
    }
    
    @AuraEnabled
    public static List<Opportunity> getCountOfAccountOpportunities(string Id){
        return new List<Opportunity>([select Id, StageName from Opportunity where AccountId=:Id]);
    }
    
    @AuraEnabled
    public static String getAvailableCountries(){
        return JSON.serialize(User.Countrycode.getDescribe().getPicklistValues());
    }
    
    @AuraEnabled
    public static String getPricebookByAccountId(String accountId){
        Account currentAccount = [Select BillingCountry from Account 
                                  WHERE Id=:accountId];
        CountrySetting__c countrySetting = [Select Pricebook__c, Tax__c
                                            from CountrySetting__c 
                                            WHERE Name =: currentAccount.BillingCountry
                                            LIMIT 1
                                           ];
        String pricebook =  JSON.serialize([SELECT Product2.Name, UnitPrice, Pricebook2.Name, CurrencyIsoCode,
                                                 Product2.Family
                                             FROM PricebookEntry
                                             WHERE Pricebook2Id =: countrySetting.Pricebook__c]);
        return '{"pricebook":'+pricebook+',"tax":'+countrySetting.Tax__c+'}';                                             
    }
}   