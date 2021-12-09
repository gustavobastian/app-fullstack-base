/**
 * class Framework
 * contains all the REST methods for access the server
 */
class Framework{
    
    /**
     * Function requestGet
     * Method that ask for the list of devices of the database
     * @param url address and port of the server
     * @param listener the handler of the response
     */
    public requestGET(url:string, listener:GetResponseListener){
         
         let xml = new XMLHttpRequest();

         xml.onreadystatechange = function respuestaServidor(){
             
          
            if(xml.readyState == 4)//status 4 all transaction performed
             {
                 listener.handlerGetResponse(xml.status, xml.response);  
             }                        
 
         }
         xml.open("GET", url,true);//true --->asincrona
         xml.send();
    }

    
    /**
     * function requestDEL
     * Function that orders to the server to remove a device.
     * @param url address and port of the server, the information of the device id is passed as parameter
     * @param listener 
     * @param data 
     */   

    public requestDEL(url:string, listener:DeleteResponseListener,data:string){
        
        let xml = new XMLHttpRequest();
        let jdata=JSON.stringify([data]);
        console.log(jdata);
        //asynchronous request method
        xml.onreadystatechange = function respuestaServidor(){
            
            if(xml.readyState == 4)//status 4 all transaction performed
            {
                listener.handlerDeleteResponse(xml.status, xml.response);      
            }                        
        }
        xml.open("DELETE", url,true);//true --->asincrona
        xml.setRequestHeader("Content-Type","application/json;charset=UTF-8");
        xml.send(jdata);
   }
   /**
    * function requestPOST
    * Function called for inserting or update a device on the database.
    * @param url address and port of the server. If it has a parameter, the server will update a device with parameter as id, 
    * if it has no parameter the server will create a new device
    * @param listener method that handle the response
    * @param data device data with JSON format
    */
   public requestPOST(url:string, listener:PostResponseListener,data:string){
        ///AJAX api rest POST NEW
        let xml = new XMLHttpRequest();
        console.log(data);
        //asynchronous request method
        xml.onreadystatechange = function respuestaServidor(){
            
            if(xml.readyState == 4)//status 4 all transaction performed
            {
                listener.handlerPostResponse(xml.status, xml.response);      
            }                        
        }
        xml.open("POST", url,true);//true --->asincrona
        xml.setRequestHeader("Content-Type","application/json;charset=UTF-8");
        xml.send(data);
    }


    /**
     * Function requestPUT
     * It is used in order to change the status of the device.
     * @param url address and port of the server
     * @param listener method who handles the response from the server
     * @param data id of the device to change state, and information of the state
     */
    public requestPUT(url:string, listener:PostResponseListener,data:string){
    ///AJAX api rest PUT for state changes
    console.log("sending state changes")
    let xml = new XMLHttpRequest();
    console.log(data);
    //asynchronous PUT method
    let jdata=JSON.stringify([data]);
    xml.onreadystatechange = function respuestaServidor(){
        
        if(xml.readyState == 4)//status 4 all transaction performed
        {
            listener.handlerPostResponse(xml.status, xml.response);      
        }                        
    }
    xml.open("PUT", url,true);//true --->asincrona
    xml.setRequestHeader("Content-Type","application/json;charset=UTF-8");
    xml.send(jdata);
}
}