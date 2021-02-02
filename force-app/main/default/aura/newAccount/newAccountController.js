({
    handleAddNewAccount : function(component, event, helper) {
        var cmpTarget = component.find('accountModal');
        var cmpBack = component.find('accountModalbackdrop');
        $A.util.addClass(cmpTarget, 'slds-fade-in-open');
        $A.util.addClass(cmpBack, 'slds-backdrop--open'); 
    },
    closeModal:function(component,event,helper){    
        var cmpTarget = component.find('accountModal');
        var cmpBack = component.find('accountModalbackdrop');
        $A.util.removeClass(cmpBack,'slds-backdrop--open');
        $A.util.removeClass(cmpTarget, 'slds-fade-in-open'); 
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
                console.log("created!!!")
                console.log();
                var assignAccountIdEvent = $A.get("e.c:assignAccountId");
                assignAccountIdEvent.setParams({ "id": response.getReturnValue().Id });
                assignAccountIdEvent.fire();
                component.set("v.newAccountNameField", "");
                component.set("v.newAccountCountryField", "");
                $A.enqueueAction(component.get('c.closeModal'));
            });
            $A.enqueueAction(action);
        }
    },
})
