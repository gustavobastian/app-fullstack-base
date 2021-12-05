class Framework{
    
    public requestGET(url:string, listener:GetResponseListener){
         ///AJAX api rest GET
         let xml = new XMLHttpRequest();

         //asynchronous request method
         xml.onreadystatechange = function respuestaServidor(){
             
             if(xml.readyState == 4)//status 4 all transaction performed
             {
                 listener.handlerGetResponse(xml.status, xml.response);  
             }                        
 
         }
         xml.open("GET", url,true);//true --->asincrona
         xml.send();
    }

    public requestDEL(url:string, listener:GetResponseListener,data:string){
        ///AJAX api rest DEL
        let xml = new XMLHttpRequest();

        //asynchronous request method
        xml.onreadystatechange = function respuestaServidor(){
            
            if(xml.readyState == 4)//status 4 all transaction performed
            {
                listener.handlerGetResponse(xml.status, xml.response);      
            }                        
        }
        xml.open("DELETE", url,true);//true --->asincrona
        xml.send(data);
   }

   public requestPOSTN(url:string, listener:GetResponseListener,data:string){
        ///AJAX api rest POST NEW
        let xml = new XMLHttpRequest();
        console.log(data);
        //asynchronous request method
        xml.onreadystatechange = function respuestaServidor(){
            
            if(xml.readyState == 4)//status 4 all transaction performed
            {
                listener.handlerGetResponse(xml.status, xml.response);      
            }                        
        }
        xml.open("POST", url,true);//true --->asincrona
        xml.setRequestHeader("Content-Type","application/json;charset=UTF-8");
        xml.send(data);
    }



    public requestPUT(url:string, listener:GetResponseListener,data:string){
    ///AJAX api rest PUT for state changes
    console.log("sending state changes")
    let xml = new XMLHttpRequest();
    console.log(data);
    //asynchronous request method
    let jdata=JSON.stringify(data);
    xml.onreadystatechange = function respuestaServidor(){
        
        if(xml.readyState == 4)//status 4 all transaction performed
        {
            listener.handlerGetResponse(xml.status, xml.response);      
        }                        
    }
    xml.open("PUT", url,true);//true --->asincrona
    
    xml.send(jdata);
}
}