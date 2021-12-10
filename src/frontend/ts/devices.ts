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

    let deviceTypeList= ["lightbulb_outline","dehaze","ac_unit","computer","audiotrack"];
    

    
    //container.innerHTML+= `<li class="collection-item avatar">`
    content+= `<div class="card blue darken-1" id="card+${disp.id}">
                           <div class="card-content white-text">
                           `

    //according to device type, different cards are assigned                                  
    
    if(disp.type<deviceTypeList.length){
       content+= `<i class=" material-icons" id="Type_${disp.id}">${deviceTypeList[disp.type]}</i>
                       <br>
                  `;}
    else {content+=`<br>`;}                                       
    if(disp.type!=2){    
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
                   `;}

    else            {
        content +=`      <span class="card-title" id="Name_${disp.id}"> ${disp.name} </span> 
                         <p id="Desc_${disp.id}">${disp.description}</p>                           
                         <form action="#">
                         <label class="white-text">Speed/Level</label>
                         <p class="range-field">
                           <input type="range" id="ck_${disp.id}" min="0" max="100" value=0 />
                         </p>`;};
                   

                              
    
   content+= `<button class="mybutton" id="edit_${disp.id}"index.html">Edit</button>`;
   
   content+= `<button class="mybutton" id="delete_${disp.id}">Delete</button>`;
   
   

    return content;
}
