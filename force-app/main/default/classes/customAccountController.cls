public class customAccountController {
    @AuraEnabled
    public static Account createAccount(String name, String country)    {
        Account acc = new Account();
        acc.Name = name;
        acc.BillingCountry = country;
        insert acc;
        return acc;
    }
}
