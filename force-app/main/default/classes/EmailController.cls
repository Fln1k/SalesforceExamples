public inherited sharing class EmailController{
	@AuraEnabled
	public static String sendAssetsEmail(String accountId){
		try{
			Map<Id, String> recipientsEmails = new Map<Id, String>();
			for (OpportunityContactRole role : [SELECT ContactId, Contact.Email
			                                    FROM OpportunityContactRole
			                                    WHERE Role = 'Maintainer']){
				recipientsEmails.put(role.ContactId, role.Contact.Email);
			}
			Account accWithOwner = [SELECT OwnerId, Owner.Email
			                        FROM Account
			                        Where Id = :accountId];
			recipientsEmails.put(accWithOwner.OwnerId, accWithOwner.Owner.Email);

			Messaging.SingleEmailMessage mail = new Messaging.SingleEmailMessage();
			mail.setSenderDisplayName('CompanySupport');
			mail.setSaveAsActivity(false);
			mail.setTargetObjectId(UserInfo.getUserId());
			mail.setWhatId(accountId);
			EmailTemplate emailTemplate = [Select Id, Subject, Description, HtmlValue, DeveloperName, Body
			                               from EmailTemplate
			                               where name = 'AccountAssets'];
			mail.setTemplateID(emailTemplate.Id);
			List<String> emails = new List<String>();
			for (Id recepientId : recipientsEmails.keySet()){
				emails.add(recipientsEmails.get(recepientId));
			}
			mail.setToAddresses(emails);
			Messaging.sendEmail(new List<Messaging.SingleEmailMessage>{mail});
			return 'Success';
		} catch (Exception e){
			return 'Error';
		}
	}
}