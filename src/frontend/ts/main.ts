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
        else if((ev.target.innerText=="Continue")&&this.statusForm=="inForm")
        {
           this.statusForm="waiting";
           this.hideForm();     
        }
        else {
            console.log(ev.target.id);       
           
        }


        }
    }

    public getElement(object:string):HTMLElement {        
        return document.getElementById(object);
    }
    //function that calls the form for including a new device on the panel
    public callForm():void{        
      console.log("creating form");
      //recovering from DOM the place where we put form  
      let containerForm=this.getElement("deviceForm");

      let content=  `<form>
                   
                   <br>  
                   <h>Device Type:</h>
                   <br>
                   <div> 
                   <p>
                   <label>
                     <input name="group1" type="radio" checked />
                     <span>Lámpara</span>
                   </label>
                 </p>
                 <p>
                   <label>
                     <input name="group1" type="radio" />
                     <span>Ventana</span>
                   </label>
                 </p>
                 <p>
                   <label>
                     <input class="with-gap" name="group1" type="radio"  />
                     <span>Aire Acondicionado</span>
                   </label>
                 </p>
                 </div>
                 <button id="Continue_button" >Continue</button>

        `;
//onclick="index.html"
      containerForm.innerHTML+=content;
      containerForm.innerHTML+= `  </form> `;              
      let continueButton=this.getElement("Continue_button");
      continueButton.addEventListener("click",this);

    }
    public hideForm():void{
        console.log("Hiding form");
     //   let containerForm=this.getElement("deviceForm");
        
        containerForm.innerHTML+= ``;
    }

    handlerGetResponse(status:number, response:string){
        let respuestaObjetos:Array<Device> = JSON.parse(response);        
        let container=this.getElement("lista");
        //drawing devices on screen
         for(let disp of respuestaObjetos)
         {  
            let content=  `<div class="col s12 m6 l5"> <div `
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