
var NumVertices = 36; //(6 faces)(2 triangles/face)(3 vertices/triangle)

var points = [];
var colors = [];

var vertices = [
    vec4( -0.5, -0.5,  0.5, 1.0 ),
    vec4( -0.5,  0.5,  0.5, 1.0 ),
    vec4(  0.5,  0.5,  0.5, 1.0 ),
    vec4(  0.5, -0.5,  0.5, 1.0 ),
    vec4( -0.5, -0.5, -0.5, 1.0 ),
    vec4( -0.5,  0.5, -0.5, 1.0 ),
    vec4(  0.5,  0.5, -0.5, 1.0 ),
    vec4(  0.5, -0.5, -0.5, 1.0 )
];

// RGBA colors
var vertexColors = [
    vec4( 0.0, 0.0, 0.0, 1.0 ),  // black
    vec4( 1.0, 0.0, 0.0, 1.0 ),  // red
    vec4( 1.0, 1.0, 0.0, 1.0 ),  // yellow
    vec4( 0.0, 1.0, 0.0, 1.0 ),  // green
    vec4( 0.0, 0.0, 1.0, 1.0 ),  // blue
    vec4( 1.0, 0.0, 1.0, 1.0 ),  // magenta
    vec4( 1.0, 1.0, 1.0, 1.0 ),  // white
    vec4( 0.0, 1.0, 1.0, 1.0 )   // cyan
];


// Parameters controlling the size of the Robot's arm

var BASE_HEIGHT      = 2.0;
var BASE_WIDTH       = 5.0;
var LOWER_ARM_HEIGHT = 5.0;
var LOWER_ARM_WIDTH  = 0.5;
var UPPER_ARM_HEIGHT = 5.0;
var UPPER_ARM_WIDTH  = 0.5;

// Shader transformation matrices

var modelViewMatrix, projectionMatrix;

// Array of rotation angles (in degrees) for each rotation axis

var Base = 0;
var LowerArm = 1;
var UpperArm = 2;


var theta= [ 0, 0, 0];

var angle = 0;

var modelViewMatrixLoc;

var vBuffer, cBuffer;

//----------------------------------------------------------------------------

function quad(  a,  b,  c,  d ) {
    colors.push(vertexColors[a]);
    points.push(vertices[a]);
    colors.push(vertexColors[a]);
    points.push(vertices[b]);
    colors.push(vertexColors[a]);
    points.push(vertices[c]);
    colors.push(vertexColors[a]);
    points.push(vertices[a]);
    colors.push(vertexColors[a]);
    points.push(vertices[c]);
    colors.push(vertexColors[a]);
    points.push(vertices[d]);
}


function colorCube() {
    quad( 1, 0, 3, 2 );
    quad( 2, 3, 7, 6 );
    quad( 3, 0, 4, 7 );
    quad( 6, 5, 1, 2 );
    quad( 4, 5, 6, 7 );
    quad( 5, 4, 0, 1 );
}

//____________________________________________

// Remmove when scale in MV.js supports scale matrices

function scale4(a, b, c) {
   var result = mat4();
   result[0][0] = a;
   result[1][1] = b;
   result[2][2] = c;
   return result;
}


//--------------------------------------------------


window.onload = function init() {

    canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    gl.viewport( 0, 0, canvas.width, canvas.height );

    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );
    gl.enable( gl.DEPTH_TEST );

    //
    //  Load shaders and initialize attribute buffers
    //
    program = initShaders( gl, "vertex-shader", "fragment-shader" );

    gl.useProgram( program );

    initObj();


    colorCube();

    // Load shaders and use the resulting shader program

    program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    // Create and initialize  buffer objects

    vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW );

    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    cBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW );

    var vColor = gl.getAttribLocation( program, "vColor" );
    gl.vertexAttribPointer( vColor, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vColor );

    document.getElementById("slider1").oninput = function(event) {
        theta[0] = event.target.value;
//console.log("theta:" + theta[0]);
		render();
    };
    document.getElementById("slider2").oninput = function(event) {
         theta[1] = event.target.value;
		render();
    };
    document.getElementById("slider3").oninput = function(event) {
         theta[2] =  event.target.value;
		render();
    };




        document.getElementById("eyeXSlider").oninput = function(){adjPos('eyeX',event.srcElement.value);};
        document.getElementById("eyeYSlider").oninput = function(){adjPos('eyeY',event.srcElement.value);};
        document.getElementById("eyeZSlider").oninput = function(){adjPos('eyeZ',event.srcElement.value);};
        document.getElementById("atXSlider").oninput = function(){adjPos('atX',event.srcElement.value);};
        document.getElementById("atYSlider").oninput = function(){adjPos('atY',event.srcElement.value);};
        document.getElementById("atZSlider").oninput = function(){adjPos('atZ',event.srcElement.value);};
        document.getElementById("upXSlider").oninput = function(){adjPos('upX',event.srcElement.value);};
        document.getElementById("upYSlider").oninput = function(){adjPos('upY',event.srcElement.value);};
        document.getElementById("upZSlider").oninput = function(){adjPos('upZ',event.srcElement.value);};
        document.getElementById("armUXSlider").oninput = function(){adjPos('armUX',event.srcElement.value);};
        document.getElementById("armUYSlider").oninput = function(){adjPos('armUY',event.srcElement.value);};
        document.getElementById("armUZSlider").oninput = function(){adjPos('armUZ',event.srcElement.value);};
        document.getElementById("armLXSlider").oninput = function(){adjPos('armLX',event.srcElement.value);};
        document.getElementById("armLYSlider").oninput = function(){adjPos('armLY',event.srcElement.value);};
        document.getElementById("armLZSlider").oninput = function(){adjPos('armLZ',event.srcElement.value);};



    modelViewMatrixLoc = gl.getUniformLocation(program, "modelViewMatrix");

    projectionMatrix = ortho(-10, 10, -10, 10, -10, 10);
    gl.uniformMatrix4fv( gl.getUniformLocation(program, "projectionMatrix"),  false, flatten(projectionMatrix) );

    render();
}


//----------------------------------------------------------------------------


function base() {
    var s = scale4(BASE_WIDTH, BASE_HEIGHT, BASE_WIDTH);
    var instanceMatrix = mult( translate( 0.0, 0.5 * BASE_HEIGHT, 0.0 ), s);
    var t = mult(modelViewMatrix, instanceMatrix);
    gl.uniformMatrix4fv(modelViewMatrixLoc,  false, flatten(t) );
    gl.drawArrays( gl.TRIANGLES, 0, NumVertices );
}

//----------------------------------------------------------------------------


function upperArm() {
    var s = scale4(UPPER_ARM_WIDTH, UPPER_ARM_HEIGHT, UPPER_ARM_WIDTH);
    var instanceMatrix = mult(translate( 0.0, 0.5 * UPPER_ARM_HEIGHT, 0.0 ),s);
    var t = mult(modelViewMatrix, instanceMatrix);
    gl.uniformMatrix4fv( modelViewMatrixLoc,  false, flatten(t) );
    gl.drawArrays( gl.TRIANGLES, 0, NumVertices );
}

//----------------------------------------------------------------------------


function lowerArm()
{
    var s = scale4(LOWER_ARM_WIDTH, LOWER_ARM_HEIGHT, LOWER_ARM_WIDTH);
    var instanceMatrix = mult( translate( 0.0, 0.5 * LOWER_ARM_HEIGHT, 0.0 ), s);
    var t = mult(modelViewMatrix, instanceMatrix);
    gl.uniformMatrix4fv( modelViewMatrixLoc,  false, flatten(t) );
    gl.drawArrays( gl.TRIANGLES, 0, NumVertices );
}

//----------------------------------------------------------------------------

var armURot = vec3(0,0,1);
var armLRot = vec3(0,0,1);
var render = function() {

    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT );

    checkCam();
    modelViewMatrix = lookAt(eye,at,up);

    //modelViewMatrix = rotate(theta[Base], 0, 1, 0 );
    modelViewMatrix = mult(modelViewMatrix,rotate(theta[Base], 0, 1, 0 ));

    base();

    modelViewMatrix = mult(modelViewMatrix, translate(0.0, BASE_HEIGHT, 0.0));
    modelViewMatrix = mult(modelViewMatrix, rotate(theta[LowerArm], armLRot[0],armLRot[1],armLRot[2]));
    lowerArm();

    modelViewMatrix  = mult(modelViewMatrix, translate(0.0, LOWER_ARM_HEIGHT, 0.0));
  //  modelViewMatrix  = mult(modelViewMatrix, rotate(theta[UpperArm], 0, 0, 1) );
    modelViewMatrix  = mult(modelViewMatrix, rotate(theta[UpperArm], armURot[0],armURot[1],armURot[2]) );
    upperArm();

    requestAnimFrame(render);
}






function adjPos(subj, value) {
  var temp = value;
  if (typeof value == 'string') {  // for browser do not support type "range"
    temp = parseFloat(temp);
  }

  switch (subj) {
    case 'eyeX': eye[0] =  temp; break;
    case 'eyeY': eye[1] =  temp; break;
    case 'eyeZ': eye[2] =  temp; break;
    case 'atX': at[0] =  temp; break;
    case 'atY': at[1] =  temp; break;
    case 'atZ': at[2] =  temp; break;
    case 'upX': up[0] =  temp; break;
    case 'upY': up[1] =  temp; break;
    case 'upZ': up[2] =  temp; break;
    case 'armUX':armURot[0] =  temp; break;
    case 'armUY':armURot[1] =  temp; break;
    case 'armUZ':armURot[2] =  temp; break;
    case 'armLX':armLRot[0] =  temp; break;
    case 'armLY':armLRot[1] =  temp; break;
    case 'armLZ':armLRot[2] =  temp; break;
  }

}



function checkCam() {
  var lookatV = subtract(at, eye);
  var upAdj = up.slice();

  if (length(up) == 0) {
    console.warn("up vector cannot be zero in length.");
    up = vec3(0, 1.0, 0);
  }

  if (length(lookatV) == 0) {
    console.warn("look at vector cannot be zero in length.");
    at = add(eye, vec3(0, 0, 1.0));
  }

  var dircheck = dot(normalize(lookatV), normalize(upAdj));

  if (Math.abs(dircheck) > 0.99999999 & Math.abs(dircheck) < 1.0000000001) {

    console.warn("up vector cannot be in same direction as look at vector");

    var axis, tf; // tf: rotate about an axis not along lookatV
    if (lookatV[0] != 0 & lookatV[1] == 0 & lookatV[2] == 0) { // along a principle plane
      tf = rotate(10, vec4(0, 1.0, 0,1.0));
    } else {
      tf = rotate(10, vec4(1.0, 0, 0,1.0));
    }
    up = multMV(tf, vec4(lookatV)).slice(0,3);
      //  console.log(up);
  }


}

var eye = vec3(-1,2,1);
var at = vec3(0,0,0);
var up = vec3(0,1,0);

var sliderMax = 5;
var sliderMin = -5;
var inits = flatten([eye,at,up,armLRot,armURot]);
function initObj() {

  var x = document.getElementsByClassName("slider");
  for (var i = 0; i< x.length; i++){
    x[i].max = sliderMax;
    x[i].min = sliderMin;
    x[i].value = inits[i];
    x[i].style.width = "100px";
  }
  x = document.getElementsByClassName("sliderMax");
  for (var i = 0; i< x.length; i++){
    x[i].innerHTML = sliderMax;
    //x[i].style.fontsize = "10%";
  }
  x = document.getElementsByClassName("sliderMin");
  for (var i = 0; i< x.length; i++){
    x[i].innerHTML = sliderMin;
  }
  isInit = false;
}
