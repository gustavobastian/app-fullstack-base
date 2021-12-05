class Device{   
    public id: number;
    public name: string;
    public description:string;
    public state : number;
    public type : number;    
}
//generate html structure for each device
function displayDevice(disp:Device):string{
    let content=  `<div class="col s12 m5 l3" >   `
    //container.innerHTML+= `<li class="collection-item avatar">`
    content+= `<div class="card blue darken-1" id="card+${disp.id}">
                           <div class="card-content white-text">
                           <span class="card-title" id="Name_${disp.id}"> ${disp.name} </span> `

    //according to device type, different cards are assigned                                  
    // type 0 => light, with switch for turn on/off the light
    if(disp.type==0){
       content+= `<i class=" material-icons">lightbulb_outline</i>
                       <br>
                                   
                       <p id="desc_${disp.id}">${disp.description}</p>                           
                       <div class="switch">
                       <label class="white-text">
                           Off`

                           if(disp.state==1)
                              {
                                  content+=`<input type="checkbox" checked id="ck_${disp.id}">`;
                                  //console.log("encendido");
                              }
                           else{  
                                  content+=`<input type="checkbox" id="ck_${disp.id}">`;
                                  //console.log("apagado");
                              }
                                         
                                  content+=`
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
                               
                       <p id="desc_${disp.id}">${disp.description}</p>
                  
                       <div class="switch">
                       <label class="white-text">
                           Cl`

             if(disp.state==1)
                {
                    content+=`<input type="checkbox" checked id="ck_${disp.id}">`;
                    //console.log("encendido");
                }
             else{  
                    content+=`<input type="checkbox" id="ck_${disp.id}">`;
                    //console.log("apagado");
                }
                           
                    content+=`
                           <span class="lever"></span>
                           Op
                       </label>
                       </div>                           
                   </div>  
           
           `;}    
     else if(disp.type==2){
     //type 2 => Air Conditioner or fan , with switch for opening/close the window and level for increase
     //decrease temperature or speed     
             content+= `<i class=" material-icons">ac_unit</i>
                         <br>
                                 
                         <p id="desc_${disp.id}">${disp.description}</p>
                    
                         <div class="switch">
                         <label class="white-text">
                             On
                             `

                             if(disp.state==1)
                                {
                                    content+=`<input type="checkbox" checked id="ck_${disp.id}">`;
                                    //console.log("encendido");
                                }
                             else{  
                                    content+=`<input type="checkbox" id="ck_${disp.id}">`;
                                    //console.log("apagado");
                                }
                                           
                                    content+=`
                             <span class="lever"></span>
                             Off
                         </label>
                         <form action="#">
                         <label class="white-text">Speed/Level</label>
                         <p class="range-field">
                           <input type="range" id="Speed_${disp.id}" min="0" max="100" oninput="showVal(this.value)" onchange="showVal(this.value)" value=0 />
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
   

    return content;
}
