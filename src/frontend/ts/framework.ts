class Framework{
    
    public requestGET(url:string, listener:GetResponseListener){
         ///AJAX api rest GET
         let xml = new XMLHttpRequest();

         xml.onreadystatechange = function respuestaServidor(){ //petición asincrona
             //console.log("llego respuesta");
             //console.log(xml.readyState);
             if(xml.readyState == 4)//status 4 all transaction performed
             {
                 listener.handlerGetResponse(xml.status, xml.response);
              

             }
                        
 
         }
         xml.open("GET", url,true);//true --->asincrona
         xml.send();
    }
}