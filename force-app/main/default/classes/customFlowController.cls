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
    public static Opportunity createOpportunity(String accountId,string postfix){
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
        Set<Id> pricebookIds = new Set<Id>();
        for(CountrySetting__c countrySetting : [Select Pricebook__c
                                                 from CountrySetting__c 
                                                 WHERE Country__c=:currentAccount.BillingCountry
                                                ]){
                                                    pricebookIds.add(countrySetting.Pricebook__c);
                                                }
        String result = JSON.serialize([SELECT Product2.Name, UnitPrice, Pricebook2.Name,CurrencyIsoCode
                                        FROM PricebookEntry
                                        WHERE Pricebook2Id in :pricebookIds]);
        return result;                                             
    }
}   