/* © 2012 
 * Alon Nativ
 */
 var myColor = "#" + Math.floor(Math.random()*16777215).toString(16);
 var counter = 0;
 var x,y;
//var serverUrl = "http://fierce-sword-7107.herokuapp.com";
var serverUrl = "http://localhost";
var port = 8888;
//var port = 80;
var canvas, context, tool,socket;
// Keep everything in anonymous function, called on window load.
if(window.addEventListener) {
window.addEventListener('load', function () {
  
  function init () {
	connect();
	// Find the canvas element.
    canvas = document.getElementById('imageView');
    if (!canvas) {
      alert('Error: I cannot find the canvas element!');
      return;
    }

    if (!canvas.getContext) {
      alert('Error: no canvas.getContext!');
      return;
    }

    // Get the 2D canvas context.
    context = canvas.getContext('2d');
	context.lineWidth = 10;
    if (!context) {
      alert('Error: failed to getContext!');
      return;
    }

    // Pencil tool instance.
    tool = new tool_pencil();

    // Attach the mousedown, mousemove and mouseup event listeners.
    canvas.addEventListener('mousedown', ev_canvas, false);
    canvas.addEventListener('mousemove', ev_canvas, false);
    canvas.addEventListener('mouseup',   ev_canvas, false);
  }
  
  function connect() {
    var cvs;
	socket = io.connect(serverUrl,{port:port});
	socket.on('paint', function (data) {
		//console.log("rec",data);
		paint(data.color, data.from_x,data.from_y,data.to_x,data.to_y);
		socket.emit('my other event', { my: 'data' });
	});
	socket.on('change-bg', function (data) {
		cvs = document.getElementById('imageView');
		cvs.style.backgroundColor = data.color;
	});
	}
  
  paint = function (color,from_x,from_y,to_x,to_y) {
	//console.log(from_x,from_y,to_x,to_y);
	//console.log(color);
	context.strokeStyle  = color;
	tool.started = true;	
	context.beginPath();
	context.moveTo(from_x,from_y);
	context.lineTo(to_x,to_y)
	context.stroke();
	tool.started = false;
}

  // This painting tool works like a drawing pencil which tracks the mouse 
  // movements.
  function tool_pencil () {
    var tool = this;
    this.started = false;

    // This is called when you start holding down the mouse button.
    // This starts the pencil drawing.
    this.mousedown = function (ev) {
        context.beginPath();
        context.moveTo(ev._x, ev._y);
        tool.started = true;
    };

    // This function is called every time you move the mouse. Obviously, it only 
    // draws if the tool.started state is set to true (when you are holding down 
    // the mouse button).
    this.mousemove = function (ev) {
	
      if (tool.started) {
		counter++;
		context.strokeStyle  = myColor;
        context.lineTo(ev._x, ev._y);
        context.stroke();
		//console.log(ev);
		//console.log(context);
		if (counter % 5 ==0) {		
		
		if (x != -1 && y != -1) {	
			socket.emit('paint',{color:myColor,from_x:x,from_y:y,to_x:ev._x,to_y:ev._y});	
			}
			x=ev._x;
			y=ev._y;
		
		}
		
		
      }
    };

    // This is called when you release the mouse button.
    this.mouseup = function (ev) {
      if (tool.started) {
        tool.mousemove(ev);
        tool.started = false;
		counter=1;
		//reset the last cords
		x=-1;
		y=-1;
      }
    };
  }

  // The general-purpose event handler. This function just determines the mouse 
  // position relative to the canvas element.
  function ev_canvas (ev) {
   
   if (ev._x || ev._x == 0) { // Firefox
		ev._x = ev._x;
      ev._y = ev._y;
    } else if (ev.offsetX || ev.offsetX == 0) { // Opera
      ev._x = ev.offsetX;
      ev._y = ev.offsetY;	  
    }

    // Call the event handler of the tool.
    var func = tool[ev.type];
    if (func) {
      func(ev);
    }
  }

  init();

}, false); }



