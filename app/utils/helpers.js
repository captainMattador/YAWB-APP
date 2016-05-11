
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
