
class Events{
        
    constructor() {
        this._eventsList = [];
    }
    
    addEvent(element, names, callback) {
        if(typeof element === 'undefined') return;
        
		names = names.split(' ');
	    for(var i = 0; i < names.length; i++) {
			element.addEventListener(names[i], callback, false);
			this._eventsList.push({
				element: element,
				name: names[i],
				listener: callback
			});
		}
	}
    
    removeAllEvents() {
        var i;
        var len = this._eventsList.length;
        for(i = len - 1; i >= 0; i--){
            this._removeEventByIndex(i);
        }
	}
    
    removeEvent(element, name) {
        this._removeEventByIndex(this._getEventIndex(element, name));
	}
    
    _removeEventByIndex(i) {
        if (i > -1) {
            this._eventsList[i].element.removeEventListener(this._eventsList[i].name, this._eventsList[i].listener, false);
            this._eventsList.splice(i, 1);
        }
	}
    
    _getEventIndex(element, name) {
        return this._eventsList.indexOf(this._eventsList.filter(event => event.element === element
            && event.name === name)[0]);
	}
}

export default Events;