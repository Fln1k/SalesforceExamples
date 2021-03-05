public with sharing class PromotionController{
	@AuraEnabled
	public static String getPromotions(List<String> productNames, String accountId, String paymentPlan){
		Set<Id> promotionsIds = new Set<Id>();
		for (Promotion_counrty__c promotionCountry : [SELECT Promotion__c
		                                              FROM Promotion_counrty__c
		                                              WHERE CountrySetting__r.Name = :AccountController.getCurrentAccountInfo(accountId).ShippingCountry
		                                              WITH security_enforced]){
			promotionsIds.add(promotionCountry.Promotion__c);
		}
		String promotionItems = JSON.serialize([SELECT Promotion__r.Name, Promotion__r.Paym__c, Promotion__r.Discount__c, Promotion__r.EndDate__c, Product__r.Name
		                                        FROM Promotion_Item__c
		                                        WHERE Product__r.Name in :productNames 
												AND Promotion__r.EndDate__c > :Date.today() 
												AND Promotion__c in :promotionsIds 
												AND Promotion__r.Paym__c includes (:paymentPlan)
		                                        WITH security_enforced]);
		return '{"entities":' + promotionItems + '}';
	}
}