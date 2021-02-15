public with sharing class customFlowController {
    @AuraEnabled
    public static Account createAccount(String name, String country)    {
        Account acc = new Account();
        acc.Name = name;
        acc.ShippingCountry = country;
        insert acc;
        return acc;
    }
    
    @AuraEnabled
    public static Opportunity createOpportunity(String accountId){
        Integer postfix=getCountOfAccountOpportunities(accountId).size()+1;
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
        Account currentAccount = [Select ShippingCountry from Account 
                                  WHERE Id=:accountId];
        CountrySetting__c countrySetting = [Select Pricebook__c, Tax__c
                                            from CountrySetting__c 
                                            WHERE Name =: currentAccount.ShippingCountry
                                            LIMIT 1
                                           ];
        String pricebook =  JSON.serialize([SELECT Id,Product2.Name, UnitPrice, Pricebook2.Name, CurrencyIsoCode,
                                            Product2.Family
                                            FROM PricebookEntry
                                            WHERE Pricebook2Id =: countrySetting.Pricebook__c]);
        return '{"pricebook":'+pricebook+',"tax":'+countrySetting.Tax__c+',"country":"'+currentAccount.ShippingCountry+'"}';                                             
    }
    
    /*@AuraEnabled
public static string createOppLineItems(String opportunityId, String productsJson){
List<OpportunityLineItem> productToDelete = [SELECT Id From OpportunityLineItem WHERE OpportunityId=:opportunityId];
List<CustomOpportunityLineItem> products = CustomOpportunityLineItem.parse(productsJson); 
savepoint beforeUpdateSavepoint = database.setsavepoint();
try{
DELETE productToDelete;

OpportunityLineItem oli = new OpportunityLineItem(
OpportunityId = opportunityId,
Quantity = 5,
PricebookEntryId = pbEntry.Id,
TotalPrice = quantity * pbEntry.UnitPrice
);
}
catch(Exception e){
database.rollback(beforeUpdateSavepoint);
}
return 'OK';
}*/
    
    @AuraEnabled
    public static Account updateAccountAndContactFields(String accountId, String contactId, String billingCountry,
                                                        String billingCity, String billingStreet, String billingPostalCode,
                                                        String billingProvince, String shippingStreet,String shippingCity, 
                                                        String shippingCountry, String shippingPostalCode, 
                                                        String shippingProvince) {
                                                            System.debug('accountId : ' + accountId);
                                                            System.debug('contactId : ' + contactId);
                                                            System.debug('billingCountry : ' + billingCountry);
                                                            System.debug('billingCity : ' + billingCity);
                                                            System.debug('billingStreet : ' + billingStreet);
                                                            System.debug('billingPostalCode : ' + billingPostalCode);
                                                            System.debug('billingProvince : ' + billingProvince);
                                                            System.debug('shippingStreet : ' + shippingStreet);
                                                            System.debug('shippingCity : ' + shippingCity);
                                                            System.debug('shippingCountry : ' + shippingCountry);
                                                            System.debug('shippingPostalCode : ' + shippingPostalCode);
                                                            System.debug('shippingProvince : ' + shippingProvince);
                                                            Account currentAccount = [Select BillingCountry, BillingCity, BillingStreet, BillingPostalCode, BillingState, 
                                                                                      ShippingStreet, ShippingCity, ShippingPostalCode, ShippingState
                                                                                      from Account 
                                                                                      WHERE Id=:accountId];
                                                            currentAccount.BillingCountry = billingCountry;
                                                            currentAccount.BillingCity = billingCity;
                                                            currentAccount.BillingStreet = billingStreet;
                                                            currentAccount.BillingPostalCode = billingPostalCode;
                                                            currentAccount.BillingState = billingProvince;
                                                            currentAccount.ShippingStreet = shippingStreet;
                                                            currentAccount.ShippingCity = shippingCity;
                                                            currentAccount.ShippingPostalCode = shippingPostalCode;
                                                            currentAccount.ShippingState = shippingProvince;
                                                            update currentAccount;
                                                            return currentAccount;
                                                        }
    
    @AuraEnabled
    public static Account getCurrentAccountInfo(String accountId) {
        Account currentAccount = [Select BillingCountry, BillingCity, BillingStreet, BillingPostalCode, BillingState, 
                                ShippingCountry, ShippingStreet, ShippingCity, ShippingPostalCode, ShippingState
                                  from Account 
                                  WHERE Id=:accountId];
        
        return currentAccount;
    }
}   