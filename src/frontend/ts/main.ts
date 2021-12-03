var M;
/** class Main
 * 
 */
class Main implements EventListenerObject,GetResponseListener{
    private nombre:string;
    private statusForm:string;
    private framework:Framework = new Framework();
    constructor(nombre:string){
        this.nombre=nombre;
        this.statusForm="waiting";
        this.framework.requestGET("http://localhost:8000/devices",this);                   
        
    }
    
    public handleEvent(ev:Event):void{
        
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
        else if((ev.target.innerText=="Cancel")&&this.statusForm=="inForm")
        {
           this.statusForm="waiting";
           this.hideForm();     
        } 
        //if we complete the form and want to publish the new device on the database
        else if((ev.target.innerText=="Send")&&this.statusForm=="inForm")
        {
           this.statusForm="waiting";
           this.sendDevice();
           this.hideForm();     
        }        
        //delete buttons inside any device
        else if((ev.target.innerText=="Delete"))
        {
          //ask for confirmation
          if (confirm('Are you sure you want to delete this device?')) {           
            this.deleteDevice(ev.target.id);           
          }           
        }
        else {
            console.log(ev.target.id);     
        }


        }
    }

    public deleteDevice(object:string){
      console.log(object);
      let deviceNumber=object.split("_");
      this.framework.requestDEL("http://localhost:8000/devices/"+deviceNumber[1],this,deviceNumber[1]);                   
      //window.alert(deviceNumber[1]);
      //console.log(object);

    }


    public sendDevice(){

      let deviceLocal= new Device();
      let deviceNameLocal= this.getElement("Device_Name");
      let deviceTypeLocal= this.getElement("Device_Type");
      let deviceDescriptionLocal= this.getElement("Device_Description");

      deviceLocal.name=deviceNameLocal.innerText;
      deviceLocal.type=parseInt(deviceTypeLocal.innerText);
      deviceLocal.description=deviceDescriptionLocal.innerText;
      if((deviceLocal.type<0)||(deviceLocal.type>3))
        {window.alert("error in the type of the device!");return;}
        
      //window.alert(deviceNumber[1]);
      console.log("sending");
     // console.log(deviceLocal);
     let result="dd";
     this.framework.requestDEL("http://localhost:8000/devices/2",this,result);                   
      return;
    }

    public getElement(object:string):HTMLElement {        
        return document.getElementById(object);
    }
    //function that calls the form for including a new device on the panel
    public callForm():void{        
      console.log("creating form");
      //recovering from DOM the place where we put form  
      let containerForm=this.getElement("deviceForm");

      let content=  `<form id="LocalForm">                   
                  <br>  
                  <h>Device Type:</h>
                  <br>
                  <p>1:light 2:window 3:fan or air conditioner</p>
                   
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

                 <button id="Cancel_button" class="btn waves-effect waves-light button-view" >Cancel</button>
                 <button id="Send_button" class="btn waves-effect waves-light button-view" >Send</button>
                 

        `;
//onclick="index.html"
      containerForm.innerHTML+=content;
      containerForm.innerHTML+= `  </form> `;              
      let CancelButton=this.getElement("Cancel_button");
      let SendButton=this.getElement("Send_button");
      CancelButton.addEventListener("click",this);
      SendButton.addEventListener("click",this);

    }
    public hideForm():void{
      //  console.log("Hiding form");
        let containerForm=this.getElement("deviceForm");
        
        containerForm.innerHTML+= ``;
    }
    
    handlerDeleteDevice(status:number, response:string,id:string){
        if(response=='ok'){console.log("object deleted")}
        else {window.alert("object couldn`t be deleted")}
    }

    handlerGetResponse(status:number, response:string){
        console.log(status);
        if(response=="Item deleted"){console.log("deleted"); return;}
        let respuestaObjetos:Array<Device> = JSON.parse(response);        
        let container=this.getElement("lista");
        //drawing devices on screen
         for(let disp of respuestaObjetos)
         {  
            let content=  `<div class="col s12 m6 l5" >   `
             //container.innerHTML+= `<li class="collection-item avatar">`
             content+= `<div class="card blue darken-1">
                                    <div class="card-content white-text">
                                    <span class="card-title"> ${disp.name} </span> `

        //according to device type, different cards are assigned                                  
        // type 0 => light, with switch for turn on/off the light
             if(disp.type==0){
                content+= `<i class=" material-icons">lightbulb_outline</i>
                                <br>
                                            
                                <p>${disp.description}</p>                           
                                <div class="switch">
                                <label class="white-text">
                                    Off
                                    <input type="checkbox" id="ck_${disp.id}">
                                    <span class="lever"></span>
                                    On
                                </label>
                                </div>                           
                            </div>
                            `;}
        //type 1 => window, with switch for opening/close the window                    
             else if(disp.type==1){
                    content+= `<i class=" material-icons">dehaze</i>
                                <br>
                                        
                                <p>${disp.description}</p>
                           
                                <div class="switch">
                                <label class="white-text">
                                    Cl
                                    <input type="checkbox" id="ck_${disp.id}">
                                    <span class="lever"></span>
                                    Op
                                </label>
                                </div>                           
                            </div>  
                    
                    `;}    
              else if(disp.type==2){
              //type 2 => Air Conditioner or fan , with switch for opening/close the window and level for increase
              //decrease temp or speed     
                      content+= `<i class=" material-icons">ac_unit</i>
                                  <br>
                                          
                                  <p>${disp.description}</p>
                             
                                  <div class="switch">
                                  <label class="white-text">
                                      On
                                      <input type="checkbox" id="ck_${disp.id}">
                                      <span class="lever"></span>
                                      Off
                                  </label>
                                  <form action="#">
                                  <label class="white-text">speed</label>
                                  <p class="range-field">
                                    <input type="range" id="Speed" min="0" max="100" oninput="showVal(this.value)" onchange="showVal(this.value)" />
                                  </p>
                                </form>
                      
                      `;}          
             else{content+= `<i class=" material-icons">ac_unit</i>
                                <br>                                               
                                <p>${disp.description}</p>
                                
                                <div class="switch">
                                <label class="white text">
                                    Off
                                    <input type="checkbox" id="ck_${disp.id}">
                                    <span class="lever"></span>
                                    On
                                </label>
                                </div>                           
                            </div>    
             
             `;}                                      
            
            content+= `<button class="mybutton" id="edit_${disp.id}"index.html">Edit</button>`;
            content+= `<button class="mybutton" id="delete_${disp.id}">Delete</button>`;
            content+= `<div id="editW_${disp.id}"></div>`;
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

    let boton=miObjeto.getElement("btn");
    let boton_agregar=miObjeto.getElement("add_device");
   
    boton.addEventListener("click",miObjeto);//no colocar ()... referencia
    boton_agregar.addEventListener("click",miObjeto);

}