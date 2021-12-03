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
        xml.open("POST", url,true);//true --->asincrona
        xml.send(data);
   }
}