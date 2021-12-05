var M;
/** class Main
 * components: 
 * name
 * statusForm: three states {wainting, inForm or inEdit}
 */
class Main implements EventListenerObject,GetResponseListener{
    private nombre:string;
    private statusForm:string;
    private deviceNumber:number;
    private framework:Framework = new Framework();
    constructor(nombre:string){
        this.nombre=nombre;
        this.statusForm="waiting";
        this.deviceNumber=0;
        this.framework.requestGET("http://localhost:8000/devices",this);                   
        
    }
    
    public handleEvent(ev:Event):void{

        let evName=ev.target.id.split("_");
        //console.log(evName[0]);
        //console.log(evName[1]);
        //for buttons
        if(ev.type == "click"){            
           console.log(ev.target.innerText);   
            
       
        //if the event is called from the add button, we call the complete form function
         if((ev.target.innerText=="add")&&this.statusForm=="waiting")
        {
           this.statusForm="inForm";
           this.callForm(); 
               
        }
        //if we cancelled the new device request we use the cancel button
        else if((ev.target.innerText=="CANCEL")&&((this.statusForm=="inForm")||(this.statusForm=="inEdit")))
        {
           this.statusForm="waiting";
           this.hideForm();     
        } 
        //if we complete the form and want to publish the new device on the database
        else if((ev.target.innerText=="SEND")&&this.statusForm=="inForm")
        {
           this.statusForm="waiting";
           console.log("sending")
           this.sendDevice();           
        } 
        else if((ev.target.innerText=="SEND")&&this.statusForm=="inEdit")
        {
           this.statusForm="waiting";
           console.log("sending")
           this.sendEditedDevice(this.deviceNumber);           
        }        
        //delete device
        else if((ev.target.innerText=="Delete"))
        {
          //ask for confirmation
          if (confirm('Are you sure you want to delete this device?')) {           
            this.deleteDevice(ev.target.id);           
          }           
        }
        //edit device
        else if((ev.target.innerText=="Edit")&&this.statusForm=="waiting")
        {
          
          this.editDevice(ev.target.id); 
          this.callForm(this.deviceNumber);               
                     
        }
        //state changes
        else if(evName[0]="ck")
        {
          this.deviceStateChange(evName[1]);
          return;
        }  
        else {
            console.log(ev.target.id);     
        }
        }
    }

    public deviceStateChange(id:number):void {
      console.log("here 2");
      let data="random";
      this.framework.requestPUT("http://localhost:8000/devices/"+id,this,data);         
      return;
    }


    public deleteDevice(object:string){
      console.log(object);
      let deviceNumber=object.split("_");
      this.framework.requestDEL("http://localhost:8000/devices/"+deviceNumber[1],this,deviceNumber[1]);                         

    }

        /*
    *getDeviceInfo:
    *parameter: 
    *id: number of device whos information is requested
    *output: device data
    */
    public getDeviceInfo(id:number):Device{
      let output= new Device();      
      return output;
    }

    public editDevice(object:string){
      console.log(object);
      let deviceNumberLocal=object.split("_");
      this.deviceNumber=parseInt(deviceNumberLocal[1]);
     // console.log("number: "+this.deviceNumber);
      //let d=this.getDeviceInfo(this.deviceNumber);
      //console.log(d.name);
      this.statusForm="inEdit";
      
      //this.framework.requestDEL("http://localhost:8000/devices/"+deviceNumber[1],this,deviceNumber[1]);                   
      //window.alert(deviceNumber[1]);
      //console.log(object);

    }

    //function for sending a new device
    public sendDevice(){

      
      let deviceNameLocal= this.getElement("Device_Name");     
      let deviceTypeLocal= this.getElement("Device_Type");
      let deviceDescriptionLocal= this.getElement("Device_Description");

      
      if((deviceTypeLocal.value<0)||(deviceTypeLocal.value>3))
        {window.alert("error in the type of the device!");return;}      
        
     
       
      let deviceLocal= {"name":deviceNameLocal.value,"type":deviceTypeLocal.value,"description":deviceDescriptionLocal.value};  
      
      let data=JSON.stringify(deviceLocal);
      //console.log(data2);

      this.framework.requestPOSTN("http://localhost:8000/devices/",this,data);                   
      return;
    }
    
    public sendEditedDevice(id:number){
      let deviceNameLocal= this.getElement("Device_Name");     
      let deviceTypeLocal= this.getElement("Device_Type");
      let deviceDescriptionLocal= this.getElement("Device_Description");
    
      if((deviceTypeLocal.value<0)||(deviceTypeLocal.value>3))
        {window.alert("error in the type of the device!");return;}      
       
      let deviceLocal= {"name":deviceNameLocal.value,"type":deviceTypeLocal.value,"description":deviceDescriptionLocal.value};  
      
      let data=JSON.stringify(deviceLocal);
      //console.log(data2);

      this.framework.requestPOSTN("http://localhost:8000/devices/"+id,this,data);                   
      return;
    }

    public getElement(object:string):HTMLElement {        
        return document.getElementById(object);
    }
    //function that calls the form for including a new device on the panel
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
    //
    public hideForm():void{
      //  console.log("Hiding form");
        let containerForm=this.getElement("deviceForm");
        
        containerForm.innerHTML+= ``;
    }
    
    //handler for managing responses from server

    handlerGetResponse(status:number, response:string){
        console.log(status);
        //response object deleted:  refresh the page, print to console 
        if(response=="Item deleted")
          {console.log("deleted");
           window.location.reload(); //page refresh
           return;}
        //response object status updated:  print to console
        if(response=="Item status Updated")
           {console.log("status updated");
          // window.location.reload(); //page refresh          
           return;}   

         
             
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
                    let checkbox = this.getElement("ck_"+disp.id);                    
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




window.onload = function(){
    let miObjeto = new Main("Gustavo");
    let boton_agregar=miObjeto.getElement("add_device");
    boton_agregar.addEventListener("click",miObjeto);

}