public with sharing class CustomOpportunityLineItem {
        public Double amount;
        public String pricebookEntryId;
        public Double price;
    
        public static List<CustomOpportunityLineItem> parse(String json) {
            return (List<CustomOpportunityLineItem>) System.JSON.deserialize(json, List<CustomOpportunityLineItem>.class);
        }   
}
