var canvas;
var gl;

var cubeNumVertices  = 36;

var pointsArray = [];
var colorsArray = [];

var cubeVertices = [
    vec4(-0.5, -0.5,  1.5, 1.0),
    vec4(-0.5,  0.5,  1.5, 1.0),
    vec4(0.5,  0.5,  1.5, 1.0),
    vec4(0.5, -0.5,  1.5, 1.0),
    vec4(-0.5, -0.5, 0.5, 1.0),
    vec4(-0.5,  0.5, 0.5, 1.0),
    vec4(0.5,  0.5, 0.5, 1.0),
    vec4( 0.5, -0.5, 0.5, 1.0)
];

var cubeVertexColors = [
    vec4( 0.0, 0.0, 0.0, 1.0 ),  // black
    vec4( 1.0, 0.0, 0.0, 1.0 ),  // red
    vec4( 1.0, 1.0, 0.0, 1.0 ),  // yellow
    vec4( 0.0, 1.0, 0.0, 1.0 ),  // green
    vec4( 0.0, 0.0, 1.0, 1.0 ),  // blue
    vec4( 1.0, 0.0, 1.0, 1.0 ),  // magenta
    vec4( 0.0, 1.0, 1.0, 1.0 ),  // cyan
    vec4( 1.0, 1.0, 1.0, 1.0 ),  // white
];

var dophVertexColors = [];


/*
var left = -1.0;
var right = 1.0;
var bottom = -1.0;
var top = 1.0;
*/



const eyeInitCube = vec3(0.0,0.0,4.0);
const atInitCube = vec3(0.0, 0.0, 0.0);
const upInitCube = vec3(0.0, 1.0, 0.0);
const nearInitCube = 0.3;
const farInitCube = 3.0;
const sliderMaxCube = 5;
const sliderMinCube = -5;


const eyeInitDop = vec3(0.0,0.0,1500.0);
const atInitDop = vec3(0.0, 0.0, 0.0);
const upInitDop = vec3(0.0, 1.0, 0.0);
const nearInitDop = 500;
const farInitDop = 2000;
const sliderMaxDop = 1500;
const sliderMinDop = -1500;

var fovyInit = 45;  // Field-of-view in Y direction angle (in degrees)

/*
var eye = eyeInit.slice();
var at = atInit.slice();
var up = upInit.slice();
var near = nearInit;
var far = farInit;
var fovy = fovyInit;
*/
var eyeInit, atInit, upInit, nearInit, farInit;
var eye,up,at,near,far,fovy;
var  aspect;       // Viewport aspect ratio


var mvMatrix, pMatrix;
var modelView, projection;

function quad(a, b, c, d) {
     pointsArray.push(cubeVertices[a]);
     colorsArray.push(cubeVertexColors [a]);
     pointsArray.push(cubeVertices[b]);
     colorsArray.push(cubeVertexColors [a]);
     pointsArray.push(cubeVertices[c]);
     colorsArray.push(cubeVertexColors [a]);
     pointsArray.push(cubeVertices[a]);
     colorsArray.push(cubeVertexColors [a]);
     pointsArray.push(cubeVertices[c]);
     colorsArray.push(cubeVertexColors [a]);
     pointsArray.push(cubeVertices[d]);
     colorsArray.push(cubeVertexColors [a]);
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

//    var x = [],y= [],z= [];
window.onload = function init() {
    canvas = document.getElementById( "gl-canvas" );
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );
    gl.enable(gl.DEPTH_TEST);
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );


    aspect =  canvas.width/canvas.height;

    // Randomly assign vertex colors

    for (i = 0; i < vertices.length; i++) {
      dophVertexColors.push(vec4(Math.random(), Math.random(), Math.random(), 1));
      //x[i] = vertices[i][0];
      //y[i] = vertices[i][1];
      //z[i] = vertices[i][2];
    }
    /*
    console.log(Math.max(...x));
    console.log(Math.max(...y));
    console.log(Math.max(...y));
    console.log(Math.min(...x));
    console.log(Math.min(...y));
    console.log(Math.min(...y));
*/

    colorCube();

    var cBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(dophVertexColors.concat(colorsArray)), gl.STATIC_DRAW );


    var vColor = gl.getAttribLocation( program, "vColor" );
    gl.vertexAttribPointer( vColor, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vColor);

    var vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(vertices.concat(pointsArray)), gl.STATIC_DRAW );

    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    var indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices_d1.concat(indices_d2).concat(indices_d3)), gl.STATIC_DRAW);

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

    document.getElementById("ReturnCam").onclick = camReturn;

    document.getElementById("nearSlider").oninput = function(){adjPos('near',event.srcElement.value);};
    document.getElementById("farSlider").oninput = function(){adjPos('far',event.srcElement.value);};
    document.getElementById("fovSlider").oninput = function(){adjPos('fov',event.srcElement.value);};

    document.getElementById("ReturnProj").onclick = projReturn;

    document.getElementById("changeObj").onchange = function() {
      obj = document.getElementById("changeObj").value;
      isInit = true;
    };

    //makeVolume();

    render();
}

function camReturn(){
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

function projReturn(){
  document.getElementById("nearSlider").value = 0;
  document.getElementById("farSlider").value = 0;
  near = nearInit;
  far = farInit;
  fovy = fovyInit;
};

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



var obj = "Cube";
var isInit = true;

var render = function() {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    if (isInit) {
      initObj();
    }

  checkCam();

  updateLabels();


  mvMatrix = lookAt(eye, at, up);
  pMatrix = perspective(fovy, aspect, near, far);

  gl.uniformMatrix4fv(modelView, false, flatten(mvMatrix));
  gl.uniformMatrix4fv(projection, false, flatten(pMatrix));


  switch (obj) {
    case 'Cube':
      gl.drawArrays(gl.TRIANGLES, vertices.length, cubeNumVertices);
    case 'Dophin':
      gl.drawElements(gl.TRIANGLES, indices_d1.length, gl.UNSIGNED_SHORT, 0);
      gl.drawElements(gl.TRIANGLES, indices_d2.length, gl.UNSIGNED_SHORT, indices_d1.length * 2);
      gl.drawElements(gl.TRIANGLES, indices_d3.length, gl.UNSIGNED_SHORT, (indices_d1.length + indices_d2.length) * 2);
  }

  requestAnimFrame(render);
}


function updateLabels(){
  document.getElementById("eyePos").innerHTML = '[' + eye[0].toFixed(2) +', '+ eye[1].toFixed(2)+', '+ eye[2].toFixed(2)+ ']';
  document.getElementById("atPos").innerHTML  = '[' + at[0].toFixed(2) +', '+  at[1].toFixed(2) +', '+ at[2].toFixed(2) + ']';
  document.getElementById("upPos").innerHTML  = '[' + up[0].toFixed(2) +', '+  up[1].toFixed(2) +', '+ up[2].toFixed(2) + ']';
  document.getElementById("nearPos").innerHTML = near;
  document.getElementById("farPos").innerHTML  = far;
  document.getElementById("fovPos").innerHTML  = fovy;
}

function initObj() {
  var sliderMax;
  switch (obj) {
    case 'Cube':
      eyeInit = eyeInitCube.slice();
      atInit = atInitCube.slice();
      upInit = upInitCube.slice();
      nearInit = nearInitCube;
      farInit = farInitCube;
      sliderMax = sliderMaxCube;
      sliderMin = sliderMinCube;
      break;
    case 'Dophin':
      eyeInit = eyeInitDop.slice();
      atInit = atInitDop.slice();
      upInit = upInitDop.slice();
      nearInit = nearInitDop;
      farInit = farInitDop;
      sliderMax = sliderMaxDop;
      sliderMin = sliderMinDop;
      break;
  }
  eye = eyeInit.slice();
  at = atInit.slice();
  up = upInit.slice();
  near = nearInit;
  far = farInit;
  fovy = fovyInit;

  var x = document.getElementsByClassName("slider");
  for (var i = 0; i< x.length; i++){
    x[i].max = sliderMax;
    x[i].min = sliderMin;
    x[i].value = 0;
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



var vVolume;
var cVolume = [1, 0, 0, 0.2]; //red
function makeVolume() {
  vVolume = [vec4(left, bottom, -near),
    vec4(right, bottom, -near),
    vec4(right, top, -near),
    vec4(left, top, -near),
    vec4(left, bottom, -far),
    vec4(right, bottom, -far),
    vec4(right, top, -far),
    vec4(left, top, -far)
  ];

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
