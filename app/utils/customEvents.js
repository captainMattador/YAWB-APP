

/**
 * 
 * GLOBAL custom events. The events here can
 * used anywhere in the app at any level
 * 
 */

/**
 * this will update the top level route
 */
export function updateRoute(routeId){
  let event = new CustomEvent('update-route', {detail: {
    route: routeId
  }});
  window.dispatchEvent(event);
}

/**
 * global message system. This will display the 
 * the message passed in the top left corner of the 
 * app
 */
export function msg(title, msg, isError, timeOut, showToSelf){
  let event = new CustomEvent('msg', {detail: {
      title: title,
      msg: msg,
      isError: isError,
      timeOut: timeOut,
      showToSelf: showToSelf
  }});
  window.dispatchEvent(event);
}

/**
 * This event will show the loading screen or hide the loading screen
 * based on the truty value passed to it
 */
export function loading(isLoading){
  let event;
  if(isLoading){
    event = new CustomEvent('loading', {});
  }else{
    event= new CustomEvent('loading-done', {});
  }
  window.dispatchEvent(event);
}
