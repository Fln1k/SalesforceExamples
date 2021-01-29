({
    handleValueChange : function(component, event) {
       console.log('handleValueChange');
       console.log(event.getParam('value'));
    },

    handleClick : function(component, event, helper) {
        console.log("clicked date child log: " + event.target.innerHTML);
        var dateClickEvent = component.getEvent("dateClickEvent");
        dateClickEvent.setParams({
            "date" : event.target.innerHTML 
        });
        dateClickEvent.fire();
    }
})