
/**
 * 
 * add helper functions to this file. If you find yourself
 * reusing functions over and over, consider adding it here.
 * 
 */


/**
 * pass a string to this function and a truthy
 * value us returned if it is a valid email format.
 */
export function validateEmail(value) {
  var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(value);
}


/**
 * helper function to get the client x and y position 
 */
export function clientPosition(e) {
    if (e.targetTouches && (e.targetTouches.length >= 1)) {
        return {
            clientX: e.targetTouches[0].clientX,
            clientY: e.targetTouches[0].clientY
        };
    }
    return {
        clientX: e.clientX,
        clientY: e.clientY
    };
}


/**
 * returns the vendor Prefix of an element
 */
export function jsVendorPrefix(prop){
    var vendors = 'Khtml Ms O Moz Webkit'.split(' ');
    var div = document.createElement('div');
    var len = vendors.length;
    var vendor;
    
    if ( prop in div.style ) return prop;
    
    prop = prop.replace(/^[a-z]/, function(val) {
        return val.toUpperCase();
    });
    
    return vendors.filter(vendor => vendor + prop in div.style)[0] + prop;
}