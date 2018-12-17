var canvas;
var gl;

var cubeNumVertices  = 36;

var pointsArray = [];
var colorsArray = [];

var cubeVertices = [
    vec4(-0.5, -0.5,  1.5, 1.0),
    vec4(-0.5,  0.5,  1.5, 1.0),
    vec4(0.5,  0.5,  1.5, 1.0), //2
    vec4(0.5, -0.5,  1.5, 1.0),
    vec4(-0.5, -0.5, 0.5, 1.0),
    vec4(-0.5,  0.5, 0.5, 1.0), //5
    vec4(0.5,  0.5, 0.5, 1.0), //6
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

const eyeInitCube = vec3(0.0,0.0,4.0);
const atInitCube = vec3(0.0, 0.0, 0.0);
const upInitCube = vec3(0.0, 1.0, 0.0);
const nearInitCube = 0.7;
const farInitCube = 7.0;
const sliderMaxCube = 7;
const sliderMinCube = -7;


const eyeInitDop = vec3(0.0,0.0,1500.0);
const atInitDop = vec3(0.0, 0.0, 0.0);
const upInitDop = vec3(0.0, 1.0, 0.0);
const nearInitDop = 200;
const farInitDop = 2000;
const sliderMaxDop = 2000;
const sliderMinDop = -2000;

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

var vBuffer;
var vVolume;
//    var x = [],y= [],z= [];
window.onload = function init() {
    canvas = document.getElementById( "gl-canvas" );
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

  //  gl.viewport( 0, 0, canvas.width, canvas.height );
    //gl.clearColor( 1.0, 1.0, 1.0, 1.0 );

    gl.viewport( canvas.width/2, canvas.height, canvas.width/2, canvas.height );
    aspect =  canvas.width/canvas.height/2;

    gl.enable(gl.DEPTH_TEST);
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );


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
    initObj();

    switch (document.getElementById("changeVol").value){
      case "cam":
      makeVolinCam();
      break;
      case "proj":
      makeVolinPrj();
      break;
  }


    colorCube();

    var cBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(dophVertexColors.concat(colorsArray).concat(colorVolArray)), gl.STATIC_DRAW );


    var vColor = gl.getAttribLocation( program, "vColor" );
    gl.vertexAttribPointer( vColor, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vColor);

    vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(vertices.concat(pointsArray).concat(vVolumeArray)), gl.STATIC_DRAW );

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


    gl.enable(gl.SCISSOR_TEST);


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
  if (isInit) {
    initObj();
  }

  // ---------------------------------------------
  // specify fraction of viewport
  gl.viewport(0, 0, canvas.width / 2, canvas.height);
  gl.scissor(0, 0, canvas.width / 2, canvas.height);
  gl.clearColor(0.8, 0.8, 0.8, 1.0); // set background
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  // set view 1 -- look at front of cube from -Z (LL view)


  checkCam();
  updateLabels();

  var M_transl, M_rot, M_proj, M_n1, M_n2;
  [mvMatrix, pMatrix, M_transl, M_rot,M_proj, M_n1, M_n2] = mProjection();
  generateTable(M_rot, 'tbCamR');
  generateTable(M_transl, 'tbCamT');
  generateTable(M_proj, 'tbPrjO');
  generateTable(M_n1, 'tbPrjN');
  generateTable(M_n2, 'tbPrjS');

  switch (document.getElementById("changeVol").value) {
    case "cam":
      makeVolinCam();
      break;
    case "proj":
      makeVolinPrj();
      break;
  }
  //mvMatrix = lookAt(eye, at, up);
  //pMatrix = perspective(fovy, aspect, near, far);

  gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
  gl.bufferSubData(gl.ARRAY_BUFFER, (vertices.length + pointsArray.length) * 16, flatten(vVolumeArray));

  gl.uniformMatrix4fv(modelView, false, flatten(mvMatrix));
  gl.uniformMatrix4fv(projection, false, flatten(pMatrix));

  switch (obj) {
    case 'Cube':
      gl.drawArrays(gl.TRIANGLES, vertices.length, pointsArray.length);
      break;
    case 'Dophin':
      gl.drawElements(gl.TRIANGLES, indices_d1.length, gl.UNSIGNED_SHORT, 0);
      gl.drawElements(gl.TRIANGLES, indices_d2.length, gl.UNSIGNED_SHORT, indices_d1.length * 2);
      gl.drawElements(gl.TRIANGLES, indices_d3.length, gl.UNSIGNED_SHORT, (indices_d1.length + indices_d2.length) * 2);
      break;
  }

  gl.drawArrays(gl.LINES, vertices.length + pointsArray.length, volArrsize1);


  // ---------------------------------------------
  // set view 2 -- look at back of cube (UR view) - sitting on +Z
  gl.viewport(canvas.width / 2, 0, canvas.width / 2, canvas.height);
  gl.scissor(canvas.width / 2, 0, canvas.width / 2, canvas.height);
  // set background
  gl.clearColor(0.6, 0.6, 0.6, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);


  var saveEye = eye.slice();
  var saveAt = at.slice();
  var saveUP = up.slice();
  var saveFar = far;
  var saveNear = near;
  switch (obj){
    case "Cube":
    eye = vec3(1.8,1.5,7.0);
    at = vec3(0,0,0);
    up = vec3(0,1,0);
    far = 30;
    near = 0.3;
    break;
    case "Dophin":
    eye = vec3(600.0,500.0,2500.0)
    at = vec3(0,0,0);
    up = vec3(0,1,0);
    far = 8000;
    near = 100;
    break;
  }
  checkCam();

  var M_transl, M_rot, M_proj, M_n1, M_n2;
  [mvMatrix, pMatrix, M_transl, M_rot,M_proj, M_n1, M_n2] = mProjection();
  //mvMatrix = lookAt(eye, at, up);
  //pMatrix = perspective(fovy, aspect, near, far);

  gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
  gl.bufferSubData(gl.ARRAY_BUFFER, (vertices.length + pointsArray.length) * 16, flatten(vVolumeArray));

  gl.uniformMatrix4fv(modelView, false, flatten(mvMatrix));
  gl.uniformMatrix4fv(projection, false, flatten(pMatrix));

  switch (obj) {
    case 'Cube':
      gl.drawArrays(gl.TRIANGLES, vertices.length, pointsArray.length);
      break;
    case 'Dophin':
      gl.drawElements(gl.TRIANGLES, indices_d1.length, gl.UNSIGNED_SHORT, 0);
      gl.drawElements(gl.TRIANGLES, indices_d2.length, gl.UNSIGNED_SHORT, indices_d1.length * 2);
      gl.drawElements(gl.TRIANGLES, indices_d3.length, gl.UNSIGNED_SHORT, (indices_d1.length + indices_d2.length) * 2);
      break;
  }

  gl.drawArrays(gl.LINES, vertices.length + pointsArray.length, volArrsize1);
  if (vVolumeArray.length - volArrsize1 > 0) {
    gl.drawArrays(gl.TRIANGLES, vertices.length + pointsArray.length + volArrsize1, vVolumeArray.length - volArrsize1);
  }

  eye = saveEye.slice();
  at = saveAt.slice();
  up = saveUP.slice();
  far = saveFar;
  near = saveNear;

  requestAnimFrame(render);
}





var topf = far*Math.tan(radians(fovy)/2);
var bottomf = -topf;
var rightf = topf*aspect;
var leftf = -rightf;

var colorVolArray = [], vVolumeArray = [];
var volArrsize1;
var vVolume = [];

var volRowName = [
  "left,btm,-near", //19
  "left,top,-near",
  "right,top,-near",
  "right,btm,-near",
  "left,btm,-far", //23
  "left,top,-far",
  "right,top,-far",
  "right,btm,-far"//26 // volume
];
function makeVolinCam(){

  vVolumeArray = [];
  colorVolArray = [];
  vVolume = [];

  topp = near*Math.tan(radians(fovy)/2);
  bottom = -topp;
  right = topp*aspect;
  left = -right;
  topf = far*Math.tan(radians(fovy)/2);
  bottomf = -topf;
  rightf = topf*aspect;
  leftf = -rightf;

  var arrowL = sliderMax*0.5/5;
  var arrowTip = arrowL/4;
  var vVolumeIni = [ // in camera csy
    vec4(0,0,0),
    vec4(arrowL,0,0),
    vec4(0,arrowL,0),
    vec4(0,0,arrowL),
    vec4(arrowL-arrowTip,0,0),  //4
    vec4(arrowL-arrowTip,arrowTip,0),
    vec4(arrowL-arrowTip,-arrowTip,0),
    vec4(arrowL-arrowTip,0,arrowTip),
    vec4(arrowL-arrowTip,0,-arrowTip),
    vec4(0,arrowL-arrowTip,0), //9
    vec4(arrowTip,arrowL-arrowTip,0),
    vec4(-arrowTip,arrowL-arrowTip,0),
    vec4(0,arrowL-arrowTip,arrowTip),
    vec4(0,arrowL-arrowTip,-arrowTip),
    vec4(0,0,arrowL-arrowTip), //14
    vec4(arrowTip,0,arrowL-arrowTip),
    vec4(-arrowTip,0,arrowL-arrowTip),
    vec4(0,arrowTip,arrowL-arrowTip),
    vec4(0,-arrowTip,arrowL-arrowTip), // CSY symbol
    vec4(left,bottom,-near), //19
    vec4(left,topp,-near),
    vec4(right,topp,-near),
    vec4(right,bottom,-near),
    vec4(leftf,bottomf,-far), //23
    vec4(leftf,topf,-far),
    vec4(rightf,topf,-far),
    vec4(rightf,bottomf,-far)//26 // volume
  ];


console.log(rightf);
  var M_transl, M_rot, M_proj, M_n1, M_n2;
  [mvMatrix, pMatrix, M_transl, M_rot,M_proj, M_n1, M_n2] = mProjection();
  for(var i = 0;i<vVolumeIni.length;i++){
    var M_transN = mat4(
      1,0,0,-M_transl[0][3],
      0,1,0,-M_transl[1][3],
      0,0,1,-M_transl[2][3],
      0,0,0,1,
    );
    vVolume[i] = multMV(M_transN,multMV(transpose(M_rot),vVolumeIni[i])); // tf back to world csy
  }


  vVolume.push(vec4(at));
   //console.log('camera   '+multMV(mvMatrix,vVolume[3] ));
//  console.log(multMV(pMatrix,multMV(mvMatrix,vVolume[3] )));
  quadVolume([0,1,1,5,1,6,1,7,1,8,5,4,6,4,7,4,8,4],1); // x vectors
  quadVolume([0,2,2,10,2,11,2,12,2,13,10,9,11,9,12,9,13,9],1); // yvector
  quadVolume([0,3,3,15,3,16,3,17,3,18,15,14,16,14,17,14,18,14],1); //z vector//should always not be seen in primary view
  quadVolume([0,27],3); // eye to at //should always not be seen in primary view
  quadVolume([19,23,20,24,21,25,22,26],2);   //should always not be seen in primary view
  quadVolume([19,20,20,21,21,22,23,24,24,25,25,26],2); //edges //should always not be seen in primary view
  volArrsize1 = vVolumeArray.length;
  //quadVolume([20,19,22,20,22,21],0); // -near //should always not be seen in primary view
  quadVolume([20,21,22,20,22,19],0); // -near //should always not be seen in primary view
  quadVolume([24,23,26,24,26,25],0); //-far  //should always not be seen in primary view


   var volMat = [];
   for(var i = 19;i<vVolume.length-1;i++){
     //volMat.push([volRowName[i-19]].concat(multMV(pMatrix,multMV(mvMatrix,vVolume[i])) ) );
     volMat.push([volRowName[i-19]].concat(multMV(mvMatrix,vVolume[i])  ));  // do not have to transform but checking matrices
   }

    generateTable(volMat,"matTableVol");

}


var volVertexColors = [
    vec4( 0.0, 0.0, 0.0, 0.2 ),  // black
    vec4( 1.0, 0.0, 0.0, 1.0),  // red
    vec4( 0.0, 1.0, 0.0, 1.0),  // green
    vec4( 0.0, 0.0, 1.0, 1.0 ),  // blue
];

function quadVolume (a,color){
  for(var i = 0;i<a.length;i++){
    vVolumeArray.push(vVolume[a[i]]);
    colorVolArray.push(volVertexColors[color]);
  }
}


function makeVolinPrj(){
  vVolumeArray = [];
  colorVolArray = [];
  vVolume = [];

  topp = near*Math.tan(radians(fovy)/2);
  right = topp*aspect;
  topf = far*Math.tan(radians(fovy)/2);
  rightf = topf*aspect;


  var arrowL = sliderMax*0.5/5;
  var arrowTip = arrowL/4;
  var vVolumeIni = [ // in projected csy
    vec4(0,0,-2*far*near/(far-near),0),
    vec4(arrowL*near/right,0,-2*far*near/(far-near),0),
    vec4(0,arrowL*near/topp,-2*far*near/(far-near),0),
    vec4(0,0,(-arrowL*(far+near)-2*far*near)/(far-near), -arrowL),
    vec4((arrowL-arrowTip)*near/right,0,-2*far*near/(far-near),0),  //4
    vec4((arrowL-arrowTip)*near/right,arrowTip*near/topp,-2*far*near/(far-near),0),
    vec4((arrowL-arrowTip)*near/right,-arrowTip*near/topp,-2*far*near/(far-near),0),
    vec4((arrowL-arrowTip)*near/right,0,(-arrowTip*(far+near)-2*far*near)/(far-near),-arrowTip),
    vec4((arrowL-arrowTip)*near/right,0,(arrowTip*(far+near)-2*far*near)/(far-near),arrowTip),
    vec4(0,(arrowL-arrowTip)*near/topp,-2*far*near/(far-near),0), //9
    vec4(arrowTip*near/right,(arrowL-arrowTip)*near/topp,-2*far*near/(far-near),0),
    vec4(-arrowTip*near/right,(arrowL-arrowTip)*near/topp,-2*far*near/(far-near),0),
    vec4(0,(arrowL-arrowTip)*near/topp,(-arrowTip*(far+near)-2*far*near)/(far-near),-arrowTip),
    vec4(0,(arrowL-arrowTip)*near/topp,(arrowTip*(far+near)-2*far*near)/(far-near),arrowTip),
    vec4(0,0, (-(arrowL-arrowTip)*(far+near)-2*far*near)/(far-near), -(arrowL-arrowTip)), //14
    vec4(arrowTip*near/right,0,(-(arrowL-arrowTip)*(far+near)-2*far*near)/(far-near),-(arrowL-arrowTip)),
    vec4(-arrowTip*near/right,0,(-(arrowL-arrowTip)*(far+near)-2*far*near)/(far-near),-(arrowL-arrowTip)),
    vec4(0,arrowTip*near/topp,(-(arrowL-arrowTip)*(far+near)-2*far*near)/(far-near),-(arrowL-arrowTip)),
    vec4(0,-arrowTip*near/topp,(-(arrowL-arrowTip)*(far+near)-2*far*near)/(far-near),-(arrowL-arrowTip)), // CSY symbol
    vec4(-1,-1,-1), //19
    vec4(-1,1,-1),
    vec4(1,1,-1),
    vec4(1,-1,-1),
    vec4(-1,-1,1), //23
    vec4(-1,1,1),
    vec4(1,1,1),
    vec4(1,-1,1)//26 // volume
  ];



  var M_transl, M_rot, M_proj, M_n1, M_n2;
  [mvMatrix, pMatrix, M_transl, M_rot,M_proj, M_n1, M_n2] = mProjection();
  for(var i = 0;i<vVolumeIni.length;i++){
    var M_transN = mat4(
      1,0,0,-M_transl[0][3],
      0,1,0,-M_transl[1][3],
      0,0,1,-M_transl[2][3],
      0,0,0,1,
    );
    var M_n1Inv = mat4( // inverse normalization matrix
      1,0,0,0,
      0,1,0,0,
      0,0,0,-1,
      0,0,-(far-near)/2/far/near,(far+near)/2/far/near,
    ); // normalization

    var M_n2Inv = mat4(
      Math.tan(radians(fovy)/2)*aspect,0,0,0,  // avoid using near
      0,Math.tan(radians(fovy)/2),0,0,
      0,0,1,0,
      0,0,0,1,
    ); // scale

    var tf =  mult(M_transN,mult(transpose(M_rot),mult(M_n2Inv ,M_n1Inv))); // tf back to world csy
    vVolume[i] = multMV(tf,vVolumeIni[i]);
  }


  vVolume.push(vec4(at));

  quadVolume([0,1,1,5,1,6,1,7,1,8,5,4,6,4,7,4,8,4],1); // x vectors
  quadVolume([0,2,2,10,2,11,2,12,2,13,10,9,11,9,12,9,13,9],1); // yvector
  quadVolume([0,3,3,15,3,16,3,17,3,18,15,14,16,14,17,14,18,14],1); //z vector
  quadVolume([0,27],3); // eye to at
  quadVolume([19,23,20,24,21,25,22,26],2);
  quadVolume([19,20,20,21,21,22,23,24,24,25,25,26],2); //edges
  volArrsize1 = vVolumeArray.length;
  //quadVolume([20,19,22,20,22,21],0); // -near //should always not be seen in primary view
  quadVolume([20,21,22,20,22,19],0); // -near //should always not be seen in primary view
  quadVolume([24,23,26,24,26,25],0); //-far  //should always not be seen in primary view


// generate table to disp
var volMat = [];
for(var i = 19;i<vVolume.length-1;i++){
  volMat.push([volRowName[i-19]].concat(multMV(mvMatrix,vVolume[i]) ) );
}

 generateTable(volMat,"matTableVol");


}

function updateLabels(){
  document.getElementById("eyePos").innerHTML = '[' + eye[0].toFixed(2) +', '+ eye[1].toFixed(2)+', '+ eye[2].toFixed(2)+ ']';
  document.getElementById("atPos").innerHTML  = '[' + at[0].toFixed(2) +', '+  at[1].toFixed(2) +', '+ at[2].toFixed(2) + ']';
  document.getElementById("upPos").innerHTML  = '[' + up[0].toFixed(2) +', '+  up[1].toFixed(2) +', '+ up[2].toFixed(2) + ']';
  document.getElementById("nearPos").innerHTML = near;
  document.getElementById("farPos").innerHTML  = far;
  document.getElementById("fovPos").innerHTML  = fovy;
}

var sliderMax;
function initObj() {
  sliderMax;
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

  if(fovy ==0){
    console.warn("fovy was zero now");
    fovy == 0.01;
  }

  if(far == near){
    console.warn("far was equal to near");
    far == near+0.01;
  }

  if(far == 0){
    console.warn("far was equal to 0");
    far == 0.01;
  }
  if(near== 0){
    console.warn("near was equal to 0");
    near == 0.01;
  }

}




var topp = near*Math.tan(radians(fovy)/2);
var bottom = -topp;
var right = topp*aspect;
var left = -right;

function mProjection() {
  M_proj = mat4(1); M_proj[3][3] = 0.0;
  //M_p = M_proj * M_n1 * M_n2;// performed in pipeline
  var M_transl = mat4(
    1.0, 0.0, 0.0, -eye[0],
    0.0, 1.0, 0.0, -eye[1],
    0.0, 0.0, 1.0, -eye[2],
    0.0, 0.0, 0.0, 1.0,
  );

  var n = normalize(subtract(at, eye)); // lookAt, normal
  var u = normalize(cross(n,up)); // perpendicular vector
  var v = normalize(cross(u,n)); // "new" up vector
  var M_rot = mat4(
      vec4(u, 0.0),
      vec4(v, 0.0),
      vec4(negate(n), 0.0),
      vec4(0.0, 0.0, 0.0, 1.0)
  );

  var M_camera = mult(M_rot, M_transl);

  topp = near*Math.tan(radians(fovy)/2);
  bottom = -topp;
  right = topp*aspect;
  left = -right;

  var M_n1 = mat4(
    1.0, 0.0, 0.0, 0.0,
    0.0, 1, 0.0, 0.0,
    0.0, 0.0, -(far+near)/(far-near), -2.0*(far*near)/(far-near),
    0.0, 0.0, -1.0, 0.0
  ); //Normalization matrix pyramid to cube
  /*
  var M_n2 = mat4(
    2.0*near/(right-left), 0.0, 0.0, 0.0,
    0.0, 2.0*near/(topp-bottom), 0.0, 0.0,
    0.0, 0.0, 1.0, 0.0,
    0.0, 0.0, 0.0, 1.0,
  ); // scale side planes to unit slope
  */
  var M_n2 = mat4(
    1/Math.tan(radians(fovy)/2)/aspect, 0.0, 0.0, 0.0, // avoid issue of near = 0
    0.0, 1/Math.tan(radians(fovy)/2), 0.0, 0.0,  // avoid issue of near = 0
    0.0, 0.0, 1.0, 0.0,
    0.0, 0.0, 0.0, 1.0,
  );
  //var M_p = mult(M_proj,mult(M_n1, M_n2));
   var M_p = mult(M_n1, M_n2);
  return [M_camera,M_p,M_transl,M_rot,M_proj,M_n1, M_n2];
  //M_tot = M_p * M_camera; // performed in shader
}


function generateTable( mat,label) {

  var table = document.getElementsByClassName(label)[0];
  table.removeChild(table.lastChild);
  var tblBody = document.createElement("tbody");


  for (var i = 0; i < mat.length; i++) {
    var row = document.createElement("tr");
    for (var j = 0; j < mat[i].length; j++) {
      var cell = document.createElement("td");
      var tmp,width;
      if(typeof mat[i][j] == "number"){
        tmp = mat[i][j].toFixed(2);
        width = "50px";
      }else if (typeof mat[i][j] == "string"){
        tmp = mat[i][j];
        width = "100px";
      }
      var cellText= document.createTextNode(tmp);
      cell.style.border="1px solid black";
      cell.style.width= width ;
      cell.appendChild(cellText);
      row.appendChild(cell);
    }
    tblBody.appendChild(row);
  }
  table.appendChild(tblBody);

}
