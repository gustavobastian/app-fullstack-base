var M;
/** class Main
 * components: 
 * name : identification for the class
 * statusForm: three states {wainting, inForm or inEdit}
 * deviceNumber: used for passing id from buttons events to methods
 * localDevice: Device for storing current data of one device(not used in the app)
 * framework: class that has all the methods for the AJAX
 */
class Main implements EventListenerObject,PostResponseListener, PutResponseListener,GetSingleResponseListener,GetResponseListener,DeleteResponseListener{
    private nombre:string;
    private statusForm:string;
    private deviceNumber:number;
    private localDevice:Device;
    private framework:Framework = new Framework();
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
            
       
        //if the event is called from the add button, we call the complete form function
         if((evInput.innerText=="add")&&this.statusForm=="waiting")
        {
           this.statusForm="inForm";
           this.callForm(0); 
               
        }
        //if we cancelled the new device request we use the cancel button
        else if((evInput.innerText=="CANCEL")&&((this.statusForm=="inForm")||(this.statusForm=="inEdit")))
        {
           this.statusForm="waiting";
           this.hideForm();     
        } 
        //if we complete the form and want to publish the new device on the database
        //Differents methods are called depending if the device is edited or a new one
        else if((evInput.innerText=="SEND")&&this.statusForm=="inForm")
        {
           this.statusForm="waiting";
           console.log("sending")
           this.sendDevice();           
        } 
        else if((evInput.innerText=="SEND")&&this.statusForm=="inEdit")
        {
           this.statusForm="waiting";
           console.log("sending")
           this.sendEditedDevice(this.deviceNumber);           
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
          this.callForm(this.deviceNumber);                                    
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
     * @param id :device whos state is needed to change
     * @returns void
     */

    public deviceStateChange(id:number):void {
      console.log("here 2");
      let data="random";
      this.framework.requestPUT("http://localhost:8000/devices/"+id,this,data);         
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
      this.framework.requestDEL("http://localhost:8000/devices/"+deviceNumber[1],this,deviceNumber[1]);
      return;                         
    }

        
    /**
     * function editDevice
     * @param object string in the form "edit_nro" with "nro" as the id of the device the user wants to edit 
     * @returns void
     */
    public editDevice(object:string):void {
      console.log(object);
      let deviceNumberLocal=object.split("_");
      this.deviceNumber=parseInt(deviceNumberLocal[1]);           
      
      this.statusForm="inEdit";
      
      //this.framework.requestGETSingle("http://localhost:8000/devices/"+this.deviceNumber,this);                   
     return;
    }

    /**
     * function sendDevice
     * Gets information from the add form, perform a check in the type of the device 
     * and send it to the AJAX method
     * @returns void
     */
    public sendDevice():void{
      
      let deviceNameLocal= <HTMLInputElement>this.getElement("Device_Name");     
      let deviceTypeLocal= <HTMLInputElement>this.getElement("Device_Type");
      let deviceDescriptionLocal= <HTMLInputElement>this.getElement("Device_Description");
      if((parseInt(deviceTypeLocal.value)<0)||(parseInt(deviceTypeLocal.value)>3))
        {
          window.alert("error in the type of the device!");
          return;
        }      
      
      let deviceLocal= {"name":deviceNameLocal.value,"type":deviceTypeLocal.value,"description":deviceDescriptionLocal.value};  
      
      let data=JSON.stringify(deviceLocal);
      //console.log(data2);

      this.framework.requestPOST("http://localhost:8000/devices/",this,data);                   
      return;
    }
    /**
     * Function sendEditedDevice
     * Gets information from the edit form, check the type and send to the AJAX method
     * @param id number of the device
     * @returns void
     */
    public sendEditedDevice(id:number):void{
      let deviceNameLocal= <HTMLInputElement>this.getElement("Device_Name");     
      let deviceTypeLocal= <HTMLInputElement>this.getElement("Device_Type");
      let deviceDescriptionLocal= <HTMLInputElement>this.getElement("Device_Description");
    
      if((parseInt(deviceTypeLocal.value)<0)||(parseInt(deviceTypeLocal.value)>3))
        {window.alert("error in the type of the device!");return;}      
       
      let deviceLocal= {"name":deviceNameLocal.value,"type":deviceTypeLocal.value,"description":deviceDescriptionLocal.value};  
      
      let data=JSON.stringify(deviceLocal);
      //console.log(data2);

      this.framework.requestPOST("http://localhost:8000/devices/"+id,this,data);                   
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
     *function callForm
     *Generate a form for collecting information of a new device or editing a existing device
     * @param num number of the device to be edite ("0" if creating a new device)
     * TODO:read from db or the DOM the values of the current object
     */
    public callForm(num:number):void{        
      console.log("creating form");
      //recovering from DOM the place where we put form  
      let containerForm=this.getElement("deviceForm");

      let content=  `<form id="LocalForm">                   
                  <br>  
                  <h>Device Type:</h>
                  <br>
                  <p>0:light 1:window 2:fan or air conditioner</p>
                   
                  <div class="input-field col s6 m6 l6">                 
                  <input placeholder="Device_Type" id="Device_Type" type="text" class="validate">
                  <label for="Device_Type">Device Type</label>
                  </div>                
                 <div class="input-field col s6 m6 l6">                 
                  <input placeholder="Device_Name" id="Device_Name" type="text" class="validate">
                  <label for="Device_Name">Device Name</label>
                 </div>

                 <div class="input-field col s6 m6 l6">                                  
                  <input placeholder="Device_Description" id="Device_Description" type="text" class="validate">
                  <label for="Device_Description">Device Description</label>
                 </div>

                 <button id="Cancel_button" class="btn waves-effect waves-light button-view" >CANCEL</button>
                 <button id="Send_button" class="btn waves-effect waves-light button-view" >SEND</button>
                 

        `;
//onclick="index.html"
      containerForm.innerHTML+=content;
      containerForm.innerHTML+= `  </form> `;
      
      let CancelButton=this.getElement("Cancel_button");
      let SendButton=this.getElement("Send_button");
      CancelButton.addEventListener("click",this);
      SendButton.addEventListener("click",this);
      window.scrollTo(0, 0); ///move to the form
    }
    /**
     * function hideForm()
     * Destroys the form used for add/editing the devices
     * @returns 
     */
    public hideForm():void{
      //  console.log("Hiding form");
        let containerForm=this.getElement("deviceForm");
        
        containerForm.innerHTML+= ``;
        return;
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
        // window.location.reload(); //page refresh          
        return;}      
          

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
        {console.log("deleted");
         window.location.reload(); //page refresh
        return;}
  }
  
    /**
     * Handler for the response of getsingleResponse method use for ask for a specified device
     * the device information received is stored in the main class component localDevice.
     * @param status status of communication
     * @param response response of the server 
     * @returns void
     * 
     */  
  handlerGetSingleResponse(status:number, response:string){
    console.log(status);      
       
    let respuestaObjeto= JSON.parse(response);     
    console.log(respuestaObjeto[0]);
    this.localDevice.name=respuestaObjeto[0].name;
    this.localDevice.type=respuestaObjeto[0].type;
    this.localDevice.description=respuestaObjeto[0].description;
    return;
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

}