let optionsCont  = document.querySelector(".options_cont");
let optionsFlag = true;

let tools_cont = document.querySelector(".tools_cont");

let pencil_cont = document.querySelector(".pencil_cont");
let eraser_cont= document.querySelector(".eraser_cont");
let pencil = document.querySelector(".pencil");
let eraser = document.querySelector(".eraser");
let pencilFlag = false;
let eraserFlag=false

let sticky = document.querySelector(".sticky-note");
let upload = document.querySelector(".upload");

optionsCont.addEventListener("click",(e)=>{
    optionsFlag=!optionsFlag;
    if(optionsFlag){
        openTools();
    }else{
        closeTools();
    }
    

})
//to open the tool panel
function openTools(){
    let iconElem = optionsCont.children[0];
    iconElem.classList.remove("fa-times");
    iconElem.classList.add("fa-bars");
    tools_cont.style.display="flex";
}
//to close the tool panel
function closeTools(){
    let iconElem = optionsCont.children[0];
    iconElem.classList.add("fa-times");
    iconElem.classList.remove("fa-bars");
    tools_cont.style.display="none";
    pencil_cont.style.display="none";
    eraser_cont.style.display="none";
}

//to show/hide pencil container
pencil.addEventListener("click",(e)=>{
    pencilFlag=!pencilFlag;
    if(pencilFlag){
        pencil_cont.style.display="block";
    }else{
        pencil_cont.style.display="none";
    }
})
//to show/hide eraser container
eraser.addEventListener("click",(e)=>{
    eraserFlag=!eraserFlag;
    if(eraserFlag){
        eraser_cont.style.display="flex";
    }else{
        eraser_cont.style.display="none";
    }
})


//to upload image from the device in a sticky-note
upload.addEventListener("click",(e)=>{

let input = document.createElement("input");  //open file explorer
input.setAttribute("type","file");
input.click();

input.addEventListener("change",(e)=>{
    let file = input.files[0];
    let url = URL.createObjectURL(file);

    let templateHTML=`
    <div class="header_cont">
        <div class="min"></div>
        <div class="remove"></div>
    </div>
    <div class="note_cont">
        <img class="stickyimg" src="${url}"/>
    </div>
    `;
 createSticky(templateHTML);
   })
})


//to open  a sticky
sticky.addEventListener("click",(e)=>{
    let stickyCont = document.createElement("div");
    stickyCont.setAttribute("class","sticky_cont");
    let templateHTML =`
    <div class="header_cont">
        <div class="min"></div>
        <div class="remove"></div>
    </div>
    <div class="note_cont">
        <textarea></textarea>
    </div>
    `;

   createSticky(templateHTML);
})


//to create sticky
function createSticky(templateHTML){
    let stickyCont = document.createElement("div");
    stickyCont.setAttribute("class","sticky_cont");
    stickyCont.innerHTML= templateHTML;

    document.body.appendChild(stickyCont);

    let min = stickyCont.querySelector(".min");
    let remove = stickyCont.querySelector(".remove");

    noteAction(min,remove,stickyCont);

    stickyCont.onmousedown = function(event) {
         dragNdrop(stickyCont,event);
      };
      
    stickyCont.ondragstart = function() {
        return false;
      };
}

//to minimize/ remove in the note
function noteAction(min,remove,stickyCont ){
    remove.addEventListener("click",(e)=>{
        stickyCont.remove();
    })

    min.addEventListener("click",(e)=>{
        let note_cont= stickyCont.querySelector(".note_cont");
        let display = getComputedStyle(note_cont).getPropertyValue("display");
        if(display === "none") note_cont.style.display = "block";
        else note_cont.style.display="none";
    })
}

//to apply drag and drop functionality
function dragNdrop(element,event)
{
    let shiftX = event.clientX - element.getBoundingClientRect().left;
    let shiftY = event.clientY - element.getBoundingClientRect().top;
  
    element.style.position = 'absolute';
    element.style.zIndex = 1000;
    
  
    moveAt(event.pageX, event.pageY);
  
    // moves the ball at (pageX, pageY) coordinates
    // taking initial shifts into account
    function moveAt(pageX, pageY) {
        element.style.left = pageX - shiftX + 'px';
        element.style.top = pageY - shiftY + 'px';
    }
  
    function onMouseMove(event) {
      moveAt(event.pageX, event.pageY);
    }
  
    // move the ball on mousemove
    document.addEventListener('mousemove', onMouseMove);
  
    // drop the ball, remove unneeded handlers
    element.onmouseup = function() {
      document.removeEventListener('mousemove', onMouseMove);
      element.onmouseup = null;
    };
}