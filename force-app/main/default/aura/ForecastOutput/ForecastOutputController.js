({
    handleValueChange : function(component, event) {
    },

    handleClick : function(component, event, helper) {
        var dateClickEvent = component.getEvent("dateClickEvent");
        dateClickEvent.setParams({
            "date" : event.target.innerHTML 
        });
        dateClickEvent.fire();
    }
})