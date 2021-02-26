@isTest
private class PricebookControllerTest{
    @testSetup
    static void setup(){
        String defaultCurrencyIsoCode = 'USD';
        Decimal defaultProductPrice = 10.0;
        Id standardPricebookId = Test.getStandardPricebookId();
        Decimal defaultPruductsAmount = 1;
        
        Account testAccount = new Account(Name = 'Test account', ShippingCountry = 'France');
        insert testAccount;
        
        Opportunity newOpportunity = new Opportunity(Name = 'Test opp', StageName = 'Prospecting', AccountId = testAccount.Id, CloseDate = date.today().addMonths(2));
        insert newOpportunity;
        
        Product2 product = new Product2(Name = 'Football Manager 2021', Family = 'PC');
        insert product;
        
        PricebookEntry standardPrice = new PricebookEntry(Pricebook2Id = standardPricebookId, Product2Id = product.Id, UnitPrice = defaultProductPrice, IsActive = true);
        insert standardPrice;
        
        Pricebook2 pricebook = new Pricebook2(Name = 'Test pricebook', CurrencyIsoCode = defaultCurrencyIsoCode, IsActive = true);
        insert pricebook;
        
        PricebookEntry pricebookEntry = new PricebookEntry(IsActive = true, CurrencyIsoCode = defaultCurrencyIsoCode, UnitPrice = defaultProductPrice, Pricebook2Id = pricebook.Id, Product2Id = product.Id);
        insert pricebookEntry;
        
        Quote newQuote = new Quote(Name = 'Test quote', OpportunityId = newOpportunity.Id, Pricebook2Id = pricebook.Id);
        insert newQuote;
        
        QuoteLineItem quoteLineItem = new QuoteLineItem(QuoteId = newQuote.Id, PricebookEntryId = pricebookEntry.Id, Quantity = defaultPruductsAmount, UnitPrice = defaultProductPrice);
        insert quoteLineItem;
        
        CountrySetting__c countrySetting = new CountrySetting__c(Name = testAccount.ShippingCountry, CurrencyIsoCode = defaultCurrencyIsoCode, Pricebook__c = pricebook.Id);
        insert countrySetting;
    }
    
    @isTest
    static void getPricebookByAccountIdTest(){
        Account account = [SELECT Id, ShippingCountry
                           FROM Account
                           LIMIT 1];
        PricebookEntry pricebookEntry = [SELECT Id, Product2.Name, UnitPrice, Pricebook2.Name, CurrencyIsoCode, Product2.Family, Pricebook2Id
                                         FROM PricebookEntry
                                         WHERE Pricebook2Id != :Test.getStandardPricebookId()
                                         LIMIT 1];
        String expectedResult = '{"pricebook":[{"attributes":{"type":"PricebookEntry","url":"/services/data/v51.0/sobjects/PricebookEntry/' + pricebookEntry.Id + '"},"Id":"' + pricebookEntry.Id + '","Product2Id":"' + pricebookEntry.Product2Id + '","UnitPrice":' + pricebookEntry.UnitPrice + ',"Pricebook2Id":"' + pricebookEntry.Pricebook2Id + '","CurrencyIsoCode":"USD","Product2":{"attributes":{"type":"Product2","url":"/services/data/v51.0/sobjects/Product2/' + pricebookEntry.Product2Id + '"},"Id":"' + pricebookEntry.Product2Id + '","Name":"' + pricebookEntry.Product2.Name + '","Family":"' + pricebookEntry.Product2.Family + '"},"Pricebook2":{"attributes":{"type":"Pricebook2","url":"/services/data/v51.0/sobjects/Pricebook2/' + pricebookEntry.Pricebook2Id + '"},"Id":"' + pricebookEntry.Pricebook2Id + '","Name":"' + pricebookEntry.Pricebook2.Name + '"}}],"tax":null,"country":"' + account.ShippingCountry + '","pricebookId":"' + pricebookEntry.Pricebook2Id + '"}';
        String result = PricebookController.getPricebookByAccountId(account.Id);
        System.assertEquals(expectedResult, result, 'Json doesn\'t matches');
    }
    
    @isTest
    static void getQuoteEntriesTest(){
        Id quoteId = [SELECT Id
                      FROM Quote
                      LIMIT 1].Id;
        
        QuoteLineItem quoteLineItem = [SELECT Id, Quantity, PricebookEntry.Product2.Name, PricebookEntry.Product2Id, PricebookEntryId
                                       FROM QuoteLineItem
                                       WHERE QuoteId = :quoteId];
        
        String expectedResult = '{"entities":[{"attributes":{"type":"QuoteLineItem","url":"/services/data/v51.0/sobjects/QuoteLineItem/' + quoteLineItem.Id + '"},"Id":"' + quoteLineItem.Id + '","Quantity":' + quoteLineItem.Quantity + ',"PricebookEntryId":"' + quoteLineItem.PricebookEntryId + '","PricebookEntry":{"attributes":{"type":"PricebookEntry","url":"/services/data/v51.0/sobjects/PricebookEntry/' + quoteLineItem.PricebookEntryId + '"},"Id":"' + quoteLineItem.PricebookEntryId + '","Product2Id":"' + quoteLineItem.PricebookEntry.Product2Id + '","Product2":{"attributes":{"type":"Product2","url":"/services/data/v51.0/sobjects/Product2/' + quoteLineItem.PricebookEntry.Product2Id + '"},"Id":"' + quoteLineItem.PricebookEntry.Product2Id + '","Name":"' + quoteLineItem.PricebookEntry.Product2.Name + '"}}}]}';
        String result = PricebookController.getQuoteEntries(quoteId);
        System.assertEquals(expectedResult, result, 'Json doesn\'t matches');
    }
}