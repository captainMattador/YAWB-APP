
import {validateEmail} from './helpers';

var formHelper = {
    getSubmitVals: function(form){
        var inputs = form.querySelectorAll('input[type="text"], input[type="email"], input[type="password"]'),
            vals = {};
        for(var i = 0; i < inputs.length; i++ ){
            let trimVal = inputs[i].value.trim();
            if(trimVal !== ''){
                vals[inputs[i].name] = trimVal;
            }
        }
        return vals;
    },
    
    validateForm: function(form){

        let inputs = form.querySelectorAll('input[type="text"], input[type="email"], input[type="password"]');
        let inputLength = inputs.length;
        let validLength = 0;

        if(form.classList.contains('clean')){
        form.classList.add('dirty');
        form.classList.remove('clean');
        }

        for(var i = 0; i < inputLength; i++){
        let valid = formHelper.validateInput(inputs[i]);
        if(valid) validLength++;
        }

        return (inputLength === validLength);
    },
    
    validateInput: function(input){
        let valid = false;
        let val = input.value.trim();
        
        if(!input.required && val === ''){
            return true;
        }
        
        if(input.type === 'email' && !input.hasAttribute('data-match')){
            valid = validateEmail(input.value);
        }else if(input.hasAttribute('data-match')){
            let matchName = input.dataset.match;
            let matchElem = document.querySelector('input[name='+matchName+']');
            valid = (input.value === matchElem.value);
        }else{
            valid = (input.getAttribute('minlength') <= input.value.length);
        }
        (valid) ? input.classList.remove('invalid') : input.classList.add('invalid');
        return valid;
    },
    
    blur(e){
        formHelper.validateInput(e.target);
    },
    
    clearForm: function(form){
        let inputs = form.querySelectorAll('input[type="text"], input[type="email"], input[type="password"]');
        for(var i = 0; i < inputs.length; i++){
            inputs[i].value = '';
        }
    },
    
    clearFile: function(elem){
        elem.value = '';
        elem.files[0]= null;
    },
    
    validImageExt: function(filename){
        return /\.(jpe?g|png|gif|bmp)$/i.test(filename);
    },
    
    validSize: function(size, maxSize){
        return size > maxSize;
    }
};

export default formHelper;