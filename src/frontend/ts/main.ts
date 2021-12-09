var M;
/** class Main
 * components: 
 * name : identification for the class
 * statusForm: three states {wainting, inForm or inEdit}
 * deviceNumber: used for passing id from buttons events to methods
 * localDevice: Device for storing current data of one device(not used in the app)
 * framework: class that has all the methods for the AJAX
 */
class Main implements EventListenerObject,PostResponseListener, PutResponseListener,GetResponseListener,DeleteResponseListener{
    public nombre:string;
    public statusForm:string;
    public deviceNumber:number;
    public localDevice:Device;
    public framework:Framework = new Framework();
    constructor(nombre:string){
        this.nombre=nombre;
        this.statusForm="waiting";
        this.deviceNumber=0;
        this.localDevice = new Device();
        
        this.framework.requestGET("http://localhost:8000/devices",this);                  
        
    }
    /**
     * function handleEvent
     * identify the events and send to the correct methods 
     * @param ev event from the window
     * @returns void
     */
    public handleEvent(ev:Event):void{

        
        const evInput =ev.target as HTMLElement; 
        let evName=evInput.id.split("_");
        
        
        //for buttons
        if(ev.type == "click"){            
           console.log(evInput.innerText);   
            
       
           
        if((evInput.innerText=="Help")&&this.statusForm=="waiting")
           {
              this.statusForm="inHelp";
              callHelp(this);                   
        }
        if((evInput.innerText=="EXIT")&&this.statusForm=="inHelp")
           {
              this.statusForm="waiting";
              hideHelp(this);                   
        }   
        //if the event is called from the add button, we call the complete form function
         if((evInput.innerText=="add")&&this.statusForm=="waiting")
        {
           this.statusForm="inForm";
           callForm(0,this); 
               
        }
        //if we cancelled the new device request we use the cancel button
        else if((evInput.innerText=="CANCEL")&&((this.statusForm=="inForm")||(this.statusForm=="inEdit")))
        {
           this.statusForm="waiting";
           hideForm(this);     
        } 
        //if we complete the form and want to publish the new device on the database(if we are editing one.. we need to send id)        
        else if((evInput.innerText=="SEND")&&(this.statusForm=="inForm"))
        {
           this.statusForm="waiting";
           this.sendDevice(0);           
        } 
        else if((evInput.innerText=="SEND")&&this.statusForm=="inEdit")
        {
           this.statusForm="waiting";
           this.sendDevice(this.deviceNumber);           
        }        
        //delete device
        else if((evInput.innerText=="Delete"))
        {
          //ask for confirmation
          if (confirm('Are you sure you want to delete this device?')) {           
            this.deleteDevice(evInput.id);           
          }           
        }
        //edit device
        else if((evInput.innerText=="Edit")&&this.statusForm=="waiting")
        {          
          this.editDevice(evInput.id); 
          callForm(this.deviceNumber,this);                                    
        }
        //Device state changes, we use a put method
        else if((evName[0]="ck")&&(this.statusForm=="waiting"))
        {
          this.deviceStateChange(parseInt(evName[1]));
          return;
        }  
        else {
            console.log(evInput.id);     
        }
        }
    }

    /**
     * Function deviceStateChange
     * @param id :device id whose state is needed to change
     * @returns void
     */

    public deviceStateChange(id:number):void {
      
      let device=<HTMLInputElement>this.getElement("ck_"+id);
      console.log(device.checked);
      let information = {
                        "id":id,
                        "status":device.checked
                      }
      
      console.log(information);
      let data=JSON.stringify(information);
      this.framework.requestPUT("http://localhost:8000/devices/",this,data);         
      return;
    }

    /**
     * function deleteDevice
     * @param object string in the form "delete_nro" with "nro" as the id of the device the user wants to delete
     * @returns void
     */ 
    public deleteDevice(object:string):void{
      console.log(object);
      let deviceNumber=object.split("_");
      this.framework.requestDEL("http://localhost:8000/devices/",this,deviceNumber[1]);
      return;                         
    }

        
    /**
     * function editDevice
     * passes the id from the button to the form 
     * @param object string in the form "edit_nro" with "nro" as the id of the device the user wants to edit 
     * @returns void
     */
    public editDevice(object:string):void {
      let deviceNumberLocal=object.split("_");
      this.deviceNumber=parseInt(deviceNumberLocal[1]);           
      this.getDevice(this.deviceNumber);
      this.statusForm="inEdit";      
      
     return;
    }

    /**
     * function sendDevice
     * Gets information from the add form, perform a check in the type of the device 
     * and send it to the AJAX method
     * @returns void
     */
    public sendDevice(id:number):void{
      
      let deviceNameLocal= <HTMLInputElement>this.getElement("Device_Name");     
      let deviceDescriptionLocal= <HTMLInputElement>this.getElement("Device_Description");
      
      let devicetypeLocal=<HTMLSelectElement> this.getElement("Device_Type_browser");
      let s=devicetypeLocal.value;                 
      let deviceTypeLocal=parseInt(s);
     

      let deviceLocal= {
                        "name":deviceNameLocal.value,
                        "type":deviceTypeLocal,
                        "description":deviceDescriptionLocal.value,
                        "id":id
                      };  
      
      let data=JSON.stringify(deviceLocal);

      
      //console.log(data2);

      this.framework.requestPOST("http://localhost:8000/devices/",this,data);                   
      return;
    }
    
    /**
     * function getElement
     * 
     * @param object string with id of the objet
     * @returns identification of the object in the DOM
     */
    public getElement(object:string):HTMLElement {        
        return document.getElementById(object);
    }
    
    /**
     * function getDevice
     * update the local device with information from the DOM
     * @param num 
     */
    public getDevice(id:number):void { 
     
      let nameLocal=<HTMLElement>this.getElement("Name_"+id);
      let descriptionLocal=<HTMLElement>this.getElement("Desc_"+id);
      let typeLocal=<HTMLElement>this.getElement("Type_"+id);
      //let typeLocal=<HTMLElement>this.getElement("Type_"+id);
      console.log("name:"+nameLocal.outerText);
      console.log(" description:"+descriptionLocal.outerText);
      console.log("type:"+typeLocal.innerText);
      this.localDevice.name=nameLocal.outerText;
      this.localDevice.description=descriptionLocal.outerText;

      if(typeLocal.innerText=="lightbulb_outline"){
        this.localDevice.type=0;
      }
      else if(typeLocal.innerText=="dehaze"){
        this.localDevice.type=1;
      }
      else if(typeLocal.innerText=="ac_unit"){
        this.localDevice.type=2;
      }
      else {
        this.localDevice.type=0;
      }
      
    }
    

    /**
     * Handler of the response of the post method
     * @param status status of the communication
     * @param response response from the server
     * @returns void
     */
    handlerPostResponse(status:number, response:string):void{
        console.log(status);
        
        //response object Item Add:  print to console
        if(response=="Item add")
        {console.log("Item added");
         window.location.reload(); //page refresh          
        return;}                
        else{
          window.alert("Error adding device");
          window.location.reload(); //page refresh
          return;  
        }        

    }

    /**
     * Handler for the response of the put method use for change the status of the device(the status is on/off)
     * @param status status of communication
     * @param response response of the server 
     * @returns void
     */
    handlerPutResponse(status:number, response:string):void{
      //console.log(status);      
      //response object status updated:  print to console
      if(response=="Item status Updated")
         {console.log("status updated");
        // window.location.reload(); //page refresh          
         return;}
      else{
          window.alert("Error updating device status");
          window.location.reload(); //page refresh
          return;  
        }        
    } 

    /**
     * Handler for the response of the delete method use for removing devices from the database
     * @param status status of communication
     * @param response response of the server 
     * @returns void
     */
    handlerDeleteResponse(status:number, response:string){
      console.log(status);
      //response object deleted:  refresh the page, print to console 
      if(response=="Item deleted")
        {
         //console.log("deleted");
         window.location.reload(); //page refresh
        return;}
      else{
        window.alert("Error deleting device");
        window.location.reload(); //page refresh
        return;

      }  
  }
  
    
    /**
     * function HandlerGetResponse
     * Calls for a list of device from the database, and generate the landing page of the application.
     * @param status communication status
     * @param response received string with all the devices in JSON format
     */

    handlerGetResponse(status:number, response:string){
        console.log(status);      
        //response for a list
        let respuestaObjetos:Array<Device> = JSON.parse(response);        
        let container=this.getElement("lista");
        //drawing devices on screen
         for(let disp of respuestaObjetos)
         {  
          let content=displayDevice(disp);  
          //console.log(log);
          container.innerHTML+=    content;   
         }
             container.innerHTML+= `  </div>`;
           
           //adding listener for objects  
           for(let disp of respuestaObjetos)
            { 
                //check boxes
                if(disp.type>=0 && disp.type<3){
                    let checkbox = <HTMLInputElement>this.getElement("ck_"+disp.id);                    
                    checkbox.addEventListener("click",this);
                    if(disp.state==1){checkbox.value="on";}
                    
                } 

                //edit and delete buttons
                let edit_button=this.getElement("edit_"+disp.id);
                edit_button.addEventListener("click",this);
                let delete_button=this.getElement("delete_"+disp.id);
                delete_button.addEventListener("click",this);
            }

         }      


}

/**
 * function that is executed when the page is loaded, it look for the "add" button and insert it in the list of the listener of
 * of eventsr.
 */


window.onload = function(){
    let miObjeto = new Main("Gustavo");
    let boton_agregar=miObjeto.getElement("add_device");
    boton_agregar.addEventListener("click",miObjeto);
    let boton_ayuda=miObjeto.getElement("Help_button");
    boton_ayuda.addEventListener("click",miObjeto);

}