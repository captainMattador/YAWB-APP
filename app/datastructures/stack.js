

var max, arr;

class Stack{
    
    constructor(obj){
        max = obj.max || 20;
        arr = [];
    }
    
    push(val){
        arr.push(val);
        
        if(arr.length > max){
            arr.splice(0, 1);
        }
    }
    
    pop(){
       var last = arr.length - 1,
           temp = arr[last];
       arr.splice(last, 1);
       return temp;
    }
    
    peek(){
        return arr[arr.length - 1];
    }
    
    size(){
       return arr.length;
    }
    
}

export default Stack;