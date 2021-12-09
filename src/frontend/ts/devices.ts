/**
 * class Device 
 * components:
 * id: identification number of the device
 * type: device type:{0:light,1:window,2:air conditioning or fan}
 * description: device description
 * state: device state(on of)
 */
class Device{   
    public id: number;
    public name: string;
    public description:string;
    public state : number;
    public type : number;    
}
/**
 *Function displayDevice
 *Generates the HTML structure for dynamically modify the web site
 * @param disp Device with information
 * @returns HTML content string
 */
function displayDevice(disp:Device):string{

    let content=  `<div class="col s12 m5 l3" >   `;
    
    //container.innerHTML+= `<li class="collection-item avatar">`
    content+= `<div class="card blue darken-1" id="card+${disp.id}">
                           <div class="card-content white-text">
                           `

    //according to device type, different cards are assigned                                  
    // type 0 => light, with switch for turn on/off the light
    if(disp.type==0){
       content+= `<i class=" material-icons" id="Type_${disp.id}">lightbulb_outline</i>
                       <br>
                  `;}
    //type 1 => window, with switch for opening/close the window                    
    else if(disp.type==1){
        content+= `<i class=" material-icons" id="Type_${disp.id}">dehaze</i>
                    <br>`;}
    //type 2 => Air Conditioner or fan , with switch for opening/close the window and level for increase
    //decrease temperature or speed     
    else if(disp.type==2){
        content+= `<i class=" material-icons" id="Type_${disp.id}">ac_unit</i>
                                            <br>`;}                
    else {content+=`<br>`;}                                       

    content+=`         <span class="card-title" id="Name_${disp.id}"> ${disp.name} </span> 
                       <p id="Desc_${disp.id}">${disp.description}</p>                           
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
                   `;
    /*   this code add a slider for fan speed or temperature selection...(needs works)
    if(disp.type==2){
        content +=`      <form action="#">
                         <label class="white-text">Speed/Level</label>
                         <p class="range-field">
                           <input type="range" id="Speed_${disp.id}" min="0" max="100" oninput="showVal(this.value)" onchange="showVal(this.value)" value=0 />
                         </p>`}
    else{
        content+=`<br><br><br><br>`;
    };      */               

                              
    
   content+= `<button class="mybutton" id="edit_${disp.id}"index.html">Edit</button>`;
   
   content+= `<button class="mybutton" id="delete_${disp.id}">Delete</button>`;
   
   

    return content;
}
