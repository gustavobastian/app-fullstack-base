/*This functions are used for generating the help menu
    * 
    */
/**
 * 
 * @param localMain Main class where is called the help
 * @returns 
 */   
function createHelp(localMain:Main):string{
    console.log("creating Help");
    let content= ` <H3>HELP </H3>
    <p> <strong>Adding device:</strong><br>
        Press "+", complete the form, and press "Send". If you want to cancel, press "Cancel".<br>
        <strong>Delete device:</strong><br>
        Press "Delete" on the selected device, and then confirm the action.<br>
        <strong>Edit device:</strong><br>
        Press "Edit" on the selected device, complete the form, and press "Send". If you want to cancel, press "Cancel".<br>
    </p>
    <button id="Exit_button" class="btn waves-effect waves-light button-view" >Exit</button>`;
    return content;

}
  /**
     * function callHelp
     * 
     * 
     * @param localMain Main class where is called the help
     */  
   function callHelp(localMain:Main):void{
    
    let content=createHelp(localMain);
    //recovering from DOM the place where we put the form  
    let containerForm=localMain.getElement("deviceForm");
    containerForm.innerHTML+=content;
    let ExitButton=localMain.getElement("Exit_button");
    ExitButton.addEventListener("click",localMain);
    window.scrollTo(0, 0); ///move to Help
    }
  
   
   /**
    * 
    * @param localMain Main class where is called the help
    * @returns 
    */
   function hideHelp(localMain:Main):void{
    //  console.log("Hiding form");
      let containerForm=localMain.getElement("deviceForm");
      
      containerForm.innerHTML= ``;
      
     // window.location.reload();
      return;
  }