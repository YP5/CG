

var canvas;
var gl;

var NumVertices  = 36;

var pointsArray = [];
var colorsArray = [];

var vertices = [
    vec4(-0.5, -0.5,  1.5, 1.0),
    vec4(-0.5,  0.5,  1.5, 1.0),
    vec4(0.5,  0.5,  1.5, 1.0),
    vec4(0.5, -0.5,  1.5, 1.0),
    vec4(-0.5, -0.5, 0.5, 1.0),
    vec4(-0.5,  0.5, 0.5, 1.0),
    vec4(0.5,  0.5, 0.5, 1.0),
    vec4( 0.5, -0.5, 0.5, 1.0)
];

var vertexColors = [
    vec4( 0.0, 0.0, 0.0, 1.0 ),  // black
    vec4( 1.0, 0.0, 0.0, 1.0 ),  // red
    vec4( 1.0, 1.0, 0.0, 1.0 ),  // yellow
    vec4( 0.0, 1.0, 0.0, 1.0 ),  // green
    vec4( 0.0, 0.0, 1.0, 1.0 ),  // blue
    vec4( 1.0, 0.0, 1.0, 1.0 ),  // magenta
    vec4( 0.0, 1.0, 1.0, 1.0 ),  // cyan
    vec4( 1.0, 1.0, 1.0, 1.0 ),  // white
];


var nearInit = 0.3;
var farInit = 3.0;
var near = nearInit;
var far = farInit;
//var radius = 4.0;
//var theta  = 0.0;
//var phi    = 0.0;
//var dr = 5.0 * Math.PI/180.0;  // eye position decided by slider

var  fovyInit = 45.0;  // Field-of-view in Y direction angle (in degrees)
var fovy = fovyInit;
var  aspect;       // Viewport aspect ratio

var mvMatrix, pMatrix;
var modelView, projection;
/*
var eye = vec3(radius * Math.sin(theta) * Math.cos(phi),
              radius * Math.sin(theta) * Math.sin(phi),
              radius * Math.cos(theta));
              */
const eyeInit = vec3(0.0,0.0,4.0);
const atInit = vec3(0.0, 0.0, 0.0);
const upInit = vec3(0.0, 1.0, 0.0);
var eye = eyeInit.slice();
var at = atInit.slice();
var up = upInit.slice();

function quad(a, b, c, d) {
     pointsArray.push(vertices[a]);
     colorsArray.push(vertexColors[a]);
     pointsArray.push(vertices[b]);
     colorsArray.push(vertexColors[a]);
     pointsArray.push(vertices[c]);
     colorsArray.push(vertexColors[a]);
     pointsArray.push(vertices[a]);
     colorsArray.push(vertexColors[a]);
     pointsArray.push(vertices[c]);
     colorsArray.push(vertexColors[a]);
     pointsArray.push(vertices[d]);
     colorsArray.push(vertexColors[a]);
}


function colorCube()
{
    quad( 1, 0, 3, 2 );
    quad( 2, 3, 7, 6 );
    quad( 3, 0, 4, 7 );
    quad( 6, 5, 1, 2 );
    quad( 4, 5, 6, 7 );
    quad( 5, 4, 0, 1 );
}


window.onload = function init() {
    canvas = document.getElementById( "gl-canvas" );
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }
    gl.viewport( 0, 0, canvas.width, canvas.height );
    aspect =  canvas.width/canvas.height;
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );
    gl.enable(gl.DEPTH_TEST);


    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    colorCube();

    var cBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(colorsArray), gl.STATIC_DRAW );

    var vColor = gl.getAttribLocation( program, "vColor" );
    gl.vertexAttribPointer( vColor, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vColor);

    var vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(pointsArray), gl.STATIC_DRAW );

    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    modelView = gl.getUniformLocation( program, "modelView" );
    projection = gl.getUniformLocation( program, "projection" );


    document.getElementById("eyeXSlider").oninput = function(){adjPos('eyeX',event.srcElement.value);};
    document.getElementById("eyeYSlider").oninput = function(){adjPos('eyeY',event.srcElement.value);};
    document.getElementById("eyeZSlider").oninput = function(){adjPos('eyeZ',event.srcElement.value);};
    document.getElementById("atXSlider").oninput = function(){adjPos('atX',event.srcElement.value);};
    document.getElementById("atYSlider").oninput = function(){adjPos('atY',event.srcElement.value);};
    document.getElementById("atZSlider").oninput = function(){adjPos('atZ',event.srcElement.value);};
    document.getElementById("upXSlider").oninput = function(){adjPos('upX',event.srcElement.value);};
    document.getElementById("upYSlider").oninput = function(){adjPos('upY',event.srcElement.value);};
    document.getElementById("upZSlider").oninput = function(){adjPos('upZ',event.srcElement.value);};

    document.getElementById("ReturnCam").onclick = function(){
      document.getElementById("eyeXSlider").value = 0;
      document.getElementById("eyeYSlider").value = 0;
      document.getElementById("eyeZSlider").value = 0;
      document.getElementById("atXSlider").value = 0;
      document.getElementById("atYSlider").value = 0;
      document.getElementById("atZSlider").value = 0;
      document.getElementById("upXSlider").value = 0;
      document.getElementById("upYSlider").value = 0;
      document.getElementById("upZSlider").value = 0;
      eye = eyeInit.slice();
      at = atInit.slice();
      up = upInit.slice();
    };

    document.getElementById("nearSlider").oninput = function(){adjPos('near',event.srcElement.value);};
    document.getElementById("farSlider").oninput = function(){adjPos('far',event.srcElement.value);};
    document.getElementById("fovSlider").oninput = function(){adjPos('fov',event.srcElement.value);};

    document.getElementById("ReturnProj").onclick = function(){
      document.getElementById("nearSlider").value = 0;
      document.getElementById("farSlider").value = 0;
      near = nearInit;
      far = farInit;
      fovy = fovyInit;
    };

    render();
}



function adjPos(subj, value) {
  var temp = value;
  if (typeof value == 'string') {  // for browser do not support type "range"
    temp = parseFloat(temp);
  }

  switch (subj) {
    case 'eyeX': eye[0] =  eyeInit[0] + temp; break;
    case 'eyeY': eye[1] =  eyeInit[1] + temp; break;
    case 'eyeZ': eye[2] =  eyeInit[2] + temp; break;
    case 'atX': at[0] =  atInit[0] + temp; break;
    case 'atY': at[1] =  atInit[1] + temp; break;
    case 'atZ': at[2] =  atInit[2] + temp; break;
    case 'upX': up[0] =  upInit[0] + temp; break;
    case 'upY': up[1] =  upInit[1] + temp; break;
    case 'upZ': up[2] =  upInit[2] + temp; break;
    case 'near':near =  nearInit + temp; break;
    case 'far': far =  farInit + temp; break;
    case 'fov': fovy =  fovyInit + temp; break;
  }

}

var render = function() {
  document.getElementById("eyePos").innerHTML = '[' + eye[0].toFixed(2) +', '+ eye[1].toFixed(2)+', '+ eye[2].toFixed(2)+ ']';
  document.getElementById("atPos").innerHTML  = '[' + at[0].toFixed(2) +', '+  at[1].toFixed(2) +', '+ at[2].toFixed(2) + ']';
  document.getElementById("upPos").innerHTML  = '[' + up[0].toFixed(2) +', '+  up[1].toFixed(2) +', '+ up[2].toFixed(2) + ']';
  document.getElementById("nearPos").innerHTML = near;
  document.getElementById("farPos").innerHTML  = far;
  document.getElementById("fovPos").innerHTML  = fovy;

  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  checkCam();

  mvMatrix = lookAt(eye, at, up);
  pMatrix = perspective(fovy, aspect, near, far);
  //console.log("camera xform: " + mvMatrix);
  //console.log("perspective xform: " + pMatrix);

  gl.uniformMatrix4fv(modelView, false, flatten(mvMatrix));
  gl.uniformMatrix4fv(projection, false, flatten(pMatrix));

  gl.drawArrays(gl.TRIANGLES, 0, NumVertices);
  requestAnimFrame(render);
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
        console.log(up);
  }



}
