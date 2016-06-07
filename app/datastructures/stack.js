

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
       if(arr.length < 1) return null;
       
       var last = arr.length - 1,
           temp = arr[last];
       arr.splice(last, 1);
       return temp;
    }
    
    peek(){
        if(arr.length < 1) return null;
        
        return arr[arr.length - 1];
    }
    
    size(){
       return arr.length;
    }

    clear(){
        arr=[];
    }    
}

export default Stack;