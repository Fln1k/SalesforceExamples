public with sharing class CustomOpportunityLineItem {
        public String amount;
        public String pricebookEntryId;
        public Integer price;
    
        public static List<CustomOpportunityLineItem> parse(String json) {
            return (List<CustomOpportunityLineItem>) System.JSON.deserialize(json, List<CustomOpportunityLineItem>.class);
        }   
}
