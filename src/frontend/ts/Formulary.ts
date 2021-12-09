   /*This functions are used for generating the form for creating a new device or editig a device
    * 
    */

   /**
     *function createForm
     *generate the html of the device editing/adding form
     * @param num id of the device to edit('0' if a new device)
     * @returns string with form preloaded
     */
     function createForm(num:number,localMain:Main):string{        
        console.log("calling form");
  
        if(localMain.statusForm=="inForm"){
          localMain.localDevice.name="Name";
          localMain.localDevice.description="Description";
          localMain.localDevice.type=0;
        }
        
        
        let content= `<form id="LocalForm">                   
                    <br>  
                    <h>Device Type:</h>
                    <br>
  
                        <div class="input-field col s12">
                        <!--<label>Choose type</label>-->
                        <form>
                        <select class="browser-default" id="Device_Type_browser">`

           if(localMain.localDevice.type==0){             
                  content+=`<option value="0" selected>light </option>
                          <option value="1">window </option>
                          <option value="2">fan or air conditioner</option>`}
           else if(localMain.localDevice.type==1){             
                            content+=`<option value="0" >light </option>
                                    <option value="1" selected>window </option>
                                    <option value="2">fan or air conditioner</option>`}               
           else if(localMain.localDevice.type==2){             
                                      content+=`<option value="0" >light </option>
                                              <option value="1" >window </option>
                                              <option value="2" selected>fan or air conditioner</option>`}               


             content+=         `</select>
                        </form>
                      </div>
                   <div class="input-field col s6 m6 l6">    
                    <br>  
                    <h>Device Name:</h>
                    <br>             
                    <input placeholder="Device_Name" id="Device_Name" type="text" class="validate" value="${localMain.localDevice.name}" >
                   <!-- <label for="Device_Name">Device_Name</label>-->
                   </div>
  
                   <div class="input-field col s6 m6 l6">                                  
                    <br>  
                    <h>Device Description:</h>
                    <br>             
                    <input placeholder="Device_Description" id="Device_Description" type="text" class="validate" value="${localMain.localDevice.description}">
                    <!--<label for="Device_Description">Device Description</label>-->
                   </div>
  
                   <button id="Cancel_button" class="btn waves-effect waves-light button-view" >CANCEL</button>
                   <button id="Send_button" class="btn waves-effect waves-light button-view" >SEND</button>
                   
                   </form> 
          `;
  
       return content;
      }
  
    /**
     * function callForm
     * 
     * @param num  id of the device('0' if new)
     * @param localMain page where is the form
     */  
    function callForm(num:number,localMain:Main):void{
        console.log("creating form");
  
        let content=createForm(num,localMain);
        //recovering from DOM the place where we put the form  
        let containerForm=localMain.getElement("deviceForm");
        containerForm.innerHTML+=content;
        
        
        let CancelButton=localMain.getElement("Cancel_button");
        let SendButton=localMain.getElement("Send_button");
        
        let devicetypeLocal= localMain.getElement("Device_Type_browser");
        devicetypeLocal.addEventListener("change",localMain);
  
        CancelButton.addEventListener("click",localMain);
        SendButton.addEventListener("click",localMain);
        window.scrollTo(0, 0); ///move to the form
  
      }
  
     /**
     * function hideForm()
     * Destroys the form used for add/editing the devices
     * @returns 
     */
    function hideForm(localMain:Main):void{
      //  console.log("Hiding form");
        let containerForm=localMain.getElement("deviceForm");
        
        containerForm.innerHTML+= ``;
        window.location.reload();
        return;
    }