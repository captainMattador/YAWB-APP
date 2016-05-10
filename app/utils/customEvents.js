
export function updateRoute(routeId){
  let event = new CustomEvent('update-route', {detail: {
    route: routeId
  }});
  window.dispatchEvent(event);
}

export function msg(title, msg, isError){
  let event = new CustomEvent('msg', {detail: {
      title: title,
      msg: msg,
      isError: isError
  }});
  window.dispatchEvent(event);
}

export function loading(isLoading){
  let event;
  if(isLoading){
    event = new CustomEvent('loading', {});
  }else{
    event= new CustomEvent('loading-done', {});
  }
  window.dispatchEvent(event);
}
