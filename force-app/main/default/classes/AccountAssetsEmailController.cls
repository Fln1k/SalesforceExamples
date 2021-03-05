public class AccountAssetsEmailController{
	public Id accId{ get; set; }

	public Id getaccId(){
		return accId;
	}

	public List<Asset> getAccountAssets(){
		return [SELECT Name, Id, Total_Price__c, CurrencyIsoCode
		        FROM Asset
		        WHERE Account.Id = :accId];
	}
}