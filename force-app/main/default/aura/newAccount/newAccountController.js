({
    closeModal:function(component,event,helper){    
        component.find("newAccountOverlay").notifyClose();
    },
    saveAccount:function(component,event,helper){    
        var name = component.get('v.newAccountNameField');
        var country = component.get('v.newAccountCountryField')
        if(name.length>0 && country.length>0)
        {
            var action = component.get('c.createAccount');
            action.setParams({
                name :name,
                country: country
            });
            action.setCallback(this,function(response){
                var assignLookupIdEvent = $A.get("e.c:assignLookupId");
                assignLookupIdEvent.setParams({ "id": response.getReturnValue().Id,"object":'Account'  });
                assignLookupIdEvent.fire();
                component.set("v.newAccountNameField", "");
                component.set("v.newAccountCountryField", "");
                $A.enqueueAction(component.get('c.closeModal'));
            });
            $A.enqueueAction(action);
        }
    },
})
