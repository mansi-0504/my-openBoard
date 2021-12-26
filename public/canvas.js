

let canvas = document.querySelector("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
let pencilColor = document.querySelectorAll(".pencil-color");
let pencilWidth = document.querySelector(".pencil-width");
let eraserWidth = document.querySelector(".eraser-width");
let download = document.querySelector(".download");
let undo = document.querySelector(".undo");
let redo = document.querySelector(".redo");

let pencolor = "black";
 let eraserColor = "white";
 let penwidth = pencilWidth.value;
 let eraserw = eraserWidth.value;

 let undoRedoTracker = [];
 let track = 0;

let mousedown= false;
//API
let tool = canvas.getContext("2d");
tool.strokeStyle = pencolor;
tool.lineWidth= "3"; 

//mouse down -> start a new path, mousemove -> path fill(graphics)

canvas.addEventListener("mousedown",(e)=>{
    mousedown= true;
    let data ={
        x:e.clientX,
        y: e.clientY
    }

    socket.emit("beginPath" , data );
})

canvas.addEventListener("mousemove",(e)=>{
    if(mousedown){
        let data = {
        x: e.clientX,
        y: e.clientY,
        color: eraserFlag ? eraserColor:pencolor,
        width: eraserFlag? eraserw : penwidth
        }
        socket.emit("drawStroke",data);
    }
   
})

canvas.addEventListener("mouseup",(e)=>{
    mousedown=false;
    let url = canvas.toDataURL();
    undoRedoTracker.push(url);
    track = undoRedoTracker.length -1;
    
})

undo.addEventListener("click",(e)=>{
    if( track > 0) track--;
    let data = {
        trackValue : track,
        undoRedoTracker
    }
   socket.emit("redoUndo",data);
})

redo.addEventListener("click",(e)=>{
    if( track < undoRedoTracker.length-1) track++;
    let data = {
        trackValue : track,
        undoRedoTracker
    }
    socket.emit("redoUndo",data);
})

function undoredocanvas(trackObj){
    track = trackObj.trackValue;
    undoRedoTracker = trackObj.undoRedoTracker;
    let url = undoRedoTracker[track];
    let img = new Image();//new image reference element
    img.src = url;
    img.onload = (e) =>{
        tool.drawImage(img,0,0,canvas.width,canvas.height);
    }

}

function beginPath(strokeObj){
    tool.beginPath();
    tool.moveTo(strokeObj.x,strokeObj.y);
}
function drawStroke(strokeObj){
    tool.strokeStyle = strokeObj.color;
    tool.lineWidth = strokeObj.width;
    tool.lineTo(strokeObj.x,strokeObj.y);
    tool.stroke();
}

pencilColor.forEach((colorElem)=>{
    colorElem.addEventListener("click",(e)=>{
        let color = colorElem.classList[0];
        pencolor= color;
        tool.strokeStyle = pencolor;
    })
})

pencilWidth.addEventListener("change",(e)=>{
    penwidth = pencilWidth.value;
    tool.lineWidth = penwidth;
})

eraserWidth.addEventListener("change",(e)=>{
    eraserw = eraserWidth.value;
    tool.lineWidth= eraserw;
})

eraser.addEventListener("click",(e)=>{
    if(eraserFlag){
        tool.strokeStyle = eraserColor;
        tool.lineWidth = eraserw;
    }else{
        tool.strokeStyle = pencolor;
        tool.lineWidth = penwidth ;
    }
})

download.addEventListener("click",(e)=>{
    url = canvas.toDataURL();
    let a = document.createElement("a");
    a.href = url;
    a.download = "board.jpg";
    a.click();
})

socket.on("beginPath", (data)=>{
    //data=> data from server
    beginPath(data);
})

socket.on("drawStroke",(data)=>{
    drawStroke(data);
})

socket.on("redoUndo",(data)=>{
    undoredocanvas(data);
})