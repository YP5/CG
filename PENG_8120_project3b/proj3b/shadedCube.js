

var canvas;
var gl;

var numVertices  = 36;

var pointsArray = [];
var normalsArray = [];

var cubevertices = [
        vec4( -0.5, -0.5,  0.5, 1.0 ),
        vec4( -0.5,  0.5,  0.5, 1.0 ),
        vec4( 0.5,  0.5,  0.5, 1.0 ),
        vec4( 0.5, -0.5,  0.5, 1.0 ),
        vec4( -0.5, -0.5, -0.5, 1.0 ),
        vec4( -0.5,  0.5, -0.5, 1.0 ),
        vec4( 0.5,  0.5, -0.5, 1.0 ),
        vec4( 0.5, -0.5, -0.5, 1.0 )
    ];


var ka1 = vec4(0.4000, 0.4000, 0.4000,1.0);
var kd1 = vec4(0.0000, 0.2000, 1.0000,1.0);
var ks1 = vec4(0.5000, 0.5000, 0.5000,1.0);
var illum1 =  2;
var Ns1 = 60.0000;

var ka2 = vec4(0.4000, 0.4000, 0.4000,1.0);
var kd2 = vec4(0.0000, 0.5000, 1.0000,1.0);
var ks2 = vec4(0.7000, 0.7000, 0.7000,1.0);
var illum2 = 2;
var Ns2 = 65.8900;

var ka3 = vec4(0.4000, 0.4000, 0.4000,1.0);
var kd3 = vec4(0.0000, 0.7000, 0.8000,1.0);
var ks3 = vec4(0.7000, 0.7000, 0.7000,1.0);
var illum3 = 2;
var Ns3 = 60.0000;


var lightAmbientIni = vec4(0.5, 0.5, 0.5, 1.0 );
var lightDiffuseIni = vec4( 1.0, 1.0, 1.0, 1.0 );
var lightSpecularIni = vec4( 0.0, 0.0, 0.0, 1.0 );
var materialAmbientIni = vec4( 0.5, 0.5, 0.5, 1.0 );
var materialDiffuseIni = vec4( 0.0, 0.2, 1.0, 1.0);
var materialSpecularIni = vec4( 1.0, 0.8, 0.0, 1.0 );
var materialShininessIni = 100.0;

var lightAmbient = lightAmbientIni.slice();
var lightDiffuse = lightDiffuseIni.slice();
var lightSpecular = lightSpecularIni.slice();
var materialAmbient = materialAmbientIni.slice();
var materialDiffuse = materialDiffuseIni.slice();
var materialSpecular = materialSpecularIni.slice();
var materialShininess = materialShininessIni;

var inits = flatten([
  lightAmbient.slice(0,3),
  lightDiffuse.slice(0,3),
  lightSpecular.slice(0,3),
  materialAmbient.slice(0,3),
  materialDiffuse.slice(0,3),
  materialSpecular.slice(0,3)
]);

var lightPosition2Cube = vec4(0.0, 0.0, 5.0, 0.0 );
var lightPosition1Cube = vec4(0.0, 5.0, 0.0, 0.0 );
var lightPosition2Dop = vec4(0.0, .0, 500.0, 0.0 );
var lightPosition1Dop = vec4(0, 500.0, 0.0, 0.0 );
var lightPosition2Tea = vec4(0.0, 0.0, 500.0, 0.0 );
var lightPosition1Tea = vec4(0.0, 500.0, 0.0, 0.0 );
var lightPosition2Bld = vec4(0.0, .0, 500.0, 0.0 );
var lightPosition1Bld = vec4(0, 500.0, 0.0, 0.0 );

var lightPositionFreeCube = vec4(1.0, 0.0, 0.0, 0.0 );
var lightPositionFreeDop = vec4(100.0, 0.0, 0.0, 0.0 );
var lightPositionFreeBld = vec4(100.0, 0.0, 500.0, 0.0 );

var lightPositionFreeTeapot = vec4(300.0, 0.0, 500.0, 0.0 );
var lightPositionFree = lightPositionFreeTeapot.slice();


var sliderMaxLigPosDop = 2000;
var sliderMinLigPosDop = -2000;
var sliderMaxLigPosCube = 30;
var sliderMinLigPosCube = -30;
var sliderMaxLigPosBld = 1000;
var sliderMinLigPosBld = -1000;
var sliderCamMax = 1;
var sliderCamMin = -1;
var initCam = [0,0,1,0,0,0,0,1,0];

var sliderMaxLigPosTeapot = 2000;
var sliderMinLigPosTeapot = -2000;

var modelView, projection;
var projectionDop = ortho(-500, 500, -500, 500, -500, 500);
var projectionCube = ortho(-1, 1, -1, 1, -100, 100);
var projectionTeapot = ortho(-400, 400, -300, 500, -400, 400);
var projectionBld = ortho(-400, 400, -300, 200, -800, 500);

var eye = vec3(0,0,1);
var at = vec3(0,0,0);
var up = vec3(0,1,0);


var x = [],y = [],z = [];
var NTUVertices = [];
for (i = 0; i < NTU_CSIE_Building.Vertices.length; i++) {
  NTUVertices.push(vec4(NTU_CSIE_Building.Vertices[i],1.0))
/*
  x[i] = NTU_CSIE_Building.Vertices[i][0];
  y[i] = NTU_CSIE_Building.Vertices[i][1];
  z[i] = NTU_CSIE_Building.Vertices[i][2];
*/
}


var NTUNormals  = [];
for (i = 0; i <NTU_CSIE_Building.Normals.length; i++) {
  NTUNormals.push(vec3(NTU_CSIE_Building.Normals[i]))
}
var TeapotVertices = [];
for (i = 0; i <teapot_model.Vertices.length; i++) {
  TeapotVertices.push(vec4(teapot_model.Vertices[i],1.0))
}

var TeapotNormals  = [];
for (i = 0; i <teapot_model.Normals.length; i++) {
  TeapotNormals.push(vec3(teapot_model.Normals[i]))
}


/*
console.log(Math.max(...x));
console.log(Math.max(...y));
console.log(Math.max(...z));
console.log(Math.min(...x));
console.log(Math.min(...y));
console.log(Math.min(...z));
*/


//var inits = lightAmbientIni.concat(lightDiffuseIni).concat(lightSpecularIni).concat(materialAmbientIni).concat(materialDiffuseIni).concat(materialSpecularIni).concat(materialShininess);

var ctm;
var ambientColor, diffuseColor, specularColor;
var viewerPos;
var program;

var xAxis = 0;
var yAxis = 1;
var zAxis = 2;
var axis = 0;
var theta =[0, 0, 0];

const sliderMax = 1;
const sliderMin = 0;

var thetaLoc;

var flag = true;

function quad(a, b, c, d) {

     var t1 = subtract(cubevertices[b], cubevertices[a]);
     var t2 = subtract(cubevertices[c], cubevertices[b]);
     var normal = cross(t1, t2);
     var normal = vec3(normal);
     normal = normalize(normal);

     pointsArray.push(cubevertices[a]);
     normalsArray.push(normal);
     pointsArray.push(cubevertices[b]);
     normalsArray.push(normal);
     pointsArray.push(cubevertices[c]);
     normalsArray.push(normal);
     pointsArray.push(cubevertices[a]);
     normalsArray.push(normal);
     pointsArray.push(cubevertices[c]);
     normalsArray.push(normal);
     pointsArray.push(cubevertices[d]);
     normalsArray.push(normal);
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

var dopNorm = [];
var dopVert  = [];
function quadTri(a, b, c) {
  var t1 = subtract(vertices[b], vertices[a]);
  var t2 = subtract(vertices[c], vertices[b]);
  var normal = cross(t1, t2);
  var normal = vec3(normal);
  normal = normalize(normal);

dopVert.push(vertices[a]);
  dopNorm.push(normal); // one for each indexed point
  dopVert.push(vertices[b]);
  dopNorm.push(normal);
  dopVert.push(vertices[c]);
  dopNorm.push(normal);
}

function normDoph() {
  var i = 0;
  while (i < indices_d1.length-2) {
    quadTri(indices_d1[i],indices_d1[i+1],indices_d1[i+2]);
    i = i+3;
  }
  i = 0;
  while (i < indices_d2.length-2) {
    quadTri(indices_d2[i],indices_d2[i+1],indices_d2[i+2]);
    i = i+3;
  }
  i = 0;
  while (i < indices_d3.length-2) {
    quadTri(indices_d3[i],indices_d3[i+1],indices_d3[i+2]);
    i = i+3;
  }
}


function quadTriTeapot(a, b, c) {
  var t1 = subtract(b, a);
  var t2 = subtract(c, b);
  var normal = cross(t1, t2);
  var normal = vec3(normal);
  normal = normalize(normal);

  teapotNormsbyInterp.push(normal); // one for each indexed point
  teapotNormsbyInterp.push(normal);
  teapotNormsbyInterp.push(normal);
}

var teapotNormsbyInterp = [];
function normTeapot(){
  for (var i = 0;i < TeapotVerts.length-2;i++) {
    quadTriTeapot(TeapotVerts[i],TeapotVerts[i+1],TeapotVerts[i+2]);
    i = i+3;
  }
  teapotNormsbyInterp.push(teapotNormsbyInterp[TeapotVerts.length-2]);
  teapotNormsbyInterp.push(teapotNormsbyInterp[TeapotVerts.length-1]);
}


var vertexShaderGouraud;
var fragmentShaderGouraud ;
var vertexShaderPhong;
var fragmentShaderPhong;
window.onload = function init() {
    canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );

    gl.enable(gl.DEPTH_TEST);


    var vertexShaderSourceGouraud =document.getElementById("vertex-shaderGouraud").text;
    var fragmentShaderSourceGouraud =document.getElementById("fragment-shaderGouraud").text;
    var vertexShaderSourcePhong =document.getElementById("vertex-shaderPhong").text;
    var fragmentShaderSourcePhong =document.getElementById("fragment-shaderPhong").text;

gl.enable(gl.BLEND);

vertexShaderGouraud = gl.createShader(gl.VERTEX_SHADER);
gl.shaderSource(vertexShaderGouraud,vertexShaderSourceGouraud);
gl.compileShader(vertexShaderGouraud);
fragmentShaderGouraud = gl.createShader(gl.FRAGMENT_SHADER);
 gl.shaderSource(fragmentShaderGouraud,fragmentShaderSourceGouraud);
 gl.compileShader(fragmentShaderGouraud);

 vertexShaderPhong = gl.createShader(gl.VERTEX_SHADER);
 gl.shaderSource(vertexShaderPhong,vertexShaderSourcePhong);
 gl.compileShader(vertexShaderPhong);
 fragmentShaderPhong = gl.createShader(gl.FRAGMENT_SHADER);
  gl.shaderSource(fragmentShaderPhong,fragmentShaderSourcePhong);
  gl.compileShader(fragmentShaderPhong);


    program = gl.createProgram();
    gl.attachShader(program, vertexShaderGouraud);
    gl.attachShader(program, fragmentShaderGouraud);
  //  gl.attachShader(program, vertexShaderPhong);
//    gl.attachShader(program, fragmentShaderPhong);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        alert("Could not initialise shaders");
    }


    //program = initShaders( gl, "vertex-shaderGouraud", "fragment-shaderGouraud" );

    gl.useProgram( program );

    initObj();
    colorCube();
    normDoph();
    normTeapot();

    var nBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, nBuffer );
    //gl.bufferData( gl.ARRAY_BUFFER, flatten(dopNorm.concat(normalsArray).concat(TeapotNormals).concat(NTUNormals)), gl.STATIC_DRAW );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(dopNorm.concat(normalsArray).concat(TeapotNorms).concat(NTUNormals)), gl.STATIC_DRAW );
  //gl.bufferData( gl.ARRAY_BUFFER, flatten(dopNorm.concat(normalsArray).concat(teapotNormsbyInterp).concat(NTUNormals)), gl.STATIC_DRAW );

    var vNormal = gl.getAttribLocation( program, "vNormal" );
    gl.vertexAttribPointer( vNormal, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vNormal );

    var vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    //gl.bufferData( gl.ARRAY_BUFFER, flatten(dopVert.concat(pointsArray).concat(TeapotVertices).concat(NTUVertices)), gl.STATIC_DRAW );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(dopVert.concat(pointsArray).concat(TeapotVerts).concat(NTUVertices)), gl.STATIC_DRAW );

    var vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

/*
    var indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices_d1.concat(indices_d2).concat(indices_d3)), gl.STATIC_DRAW);
*/

    thetaLoc = gl.getUniformLocation(program, "theta");

    viewerPos = vec3(0.0, 0.0, -20.0 );

    //projection = ortho(-1, 1, -1, 1, -100, 100);


    document.getElementById("ButtonX").onclick = function(){axis = xAxis;};
    document.getElementById("ButtonY").onclick = function(){axis = yAxis;};
    document.getElementById("ButtonZ").onclick = function(){axis = zAxis;};
    document.getElementById("ButtonT").onclick = function(){flag = !flag;};


       document.getElementById("ambientRSlider").oninput = function(){adjPos('ambientR',event.srcElement.value);};
       document.getElementById("ambientGSlider").oninput = function(){adjPos('ambientG',event.srcElement.value);};
       document.getElementById("ambientBSlider").oninput = function(){adjPos('ambientB',event.srcElement.value);};
       document.getElementById("diffuseRSlider").oninput = function(){adjPos('diffuseR',event.srcElement.value);};
       document.getElementById("diffuseGSlider").oninput = function(){adjPos('diffuseG',event.srcElement.value);};
       document.getElementById("diffuseBSlider").oninput = function(){adjPos('diffuseB',event.srcElement.value);};
       document.getElementById("specularRSlider").oninput = function(){adjPos('specularR',event.srcElement.value);};
       document.getElementById("specularGSlider").oninput = function(){adjPos('specularG',event.srcElement.value);};
       document.getElementById("specularBSlider").oninput = function(){adjPos('specularB',event.srcElement.value);};

       document.getElementById("mAmbientRSlider").oninput = function(){adjPos('mAmbientR',event.srcElement.value);};
       document.getElementById("mAmbientGSlider").oninput = function(){adjPos('mAmbientG',event.srcElement.value);};
       document.getElementById("mAmbientBSlider").oninput = function(){adjPos('mAmbientB',event.srcElement.value);};
       document.getElementById("mDiffuseRSlider").oninput = function(){adjPos('mDiffuseR',event.srcElement.value);};
       document.getElementById("mDiffuseGSlider").oninput = function(){adjPos('mDiffuseG',event.srcElement.value);};
       document.getElementById("mDiffuseBSlider").oninput = function(){adjPos('mDiffuseB',event.srcElement.value);};
       document.getElementById("mSpecularRSlider").oninput = function(){adjPos('mSpecularR',event.srcElement.value);};
       document.getElementById("mSpecularGSlider").oninput = function(){adjPos('mSpecularG',event.srcElement.value);};
       document.getElementById("mSpecularBSlider").oninput = function(){adjPos('mSpecularB',event.srcElement.value);};

       document.getElementById("mShinSlider").oninput = function(){adjPos('mShin',event.srcElement.value);};

       document.getElementById("light3XSlider").oninput = function(){adjPos('lightX',event.srcElement.value);};
       document.getElementById("light3YSlider").oninput = function(){adjPos('lightY',event.srcElement.value);};
       document.getElementById("light3ZSlider").oninput = function(){adjPos('lightZ',event.srcElement.value);};



       document.getElementById("changeObj").onchange = function() {
         obj = document.getElementById("changeObj").value;
         isInit = true;
       };


       document.getElementById("changeView").onchange = changeView;
       document.getElementById("changeShading").onchange = function() {
         switch(document.getElementById("changeShading").value){
           case "vertex":
           gl.detachShader(program, vertexShaderPhong);
           gl.detachShader(program, fragmentShaderPhong);
           gl.attachShader(program, vertexShaderGouraud);
           gl.attachShader(program, fragmentShaderGouraud);
           gl.linkProgram(program);

           if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
               alert("Could not initialise shaders");
           }
           break;
           case "fragment":
           gl.detachShader(program, vertexShaderGouraud);
           gl.detachShader(program, fragmentShaderGouraud);
           gl.attachShader(program, vertexShaderPhong);
           gl.attachShader(program, fragmentShaderPhong);
           gl.linkProgram(program);

           if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
               alert("Could not initialise shaders");
           }
           break;
         }

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


    render();
}


function createShader(gl, type, shaderSource) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, shaderSource);
  gl.compileShader(shader);
  const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
  if(!success) {
    console.warn(gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
  }
  return shader;
}

//https://product.canva.com/WebGL-David-Guan/


function adjPos(subj, value) {
  var temp = value;
  var strtmp = 1-temp;
  if (typeof value == 'string') {  // for browser do not support type "range"
    temp = parseFloat(temp);
    strtmp = (strtmp).toString();
  }

  switch (subj) {
    case 'ambientR': lightAmbient[0] =  temp; break;
    case 'ambientG': lightAmbient[1] = temp; break;
    case 'ambientB': lightAmbient[2] = temp; break;
    case 'diffuseR': lightDiffuse[0] =  temp; lightSpecular[0] = strtmp;
    document.getElementById("specularRSlider").value = strtmp; break;
    case 'diffuseG': lightDiffuse[1] =  temp; lightSpecular[1] = strtmp;
    document.getElementById("specularGSlider").value = strtmp;break;
    case 'diffuseB': lightDiffuse[2] =  temp; lightSpecular[2] = strtmp;
    document.getElementById("specularBSlider").value = strtmp;break;
    case 'specularR': lightSpecular[0] =  temp; lightDiffuse[0] = strtmp;
    document.getElementById("diffuseRSlider").value = strtmp;break;
    case 'specularG': lightSpecular[1] =  temp; lightDiffuse[1] = strtmp;
    document.getElementById("diffuseGSlider").value = strtmp;break;
    case 'specularB': lightSpecular[2] =  temp; lightDiffuse[2] = strtmp;
    document.getElementById("diffuseBSlider").value = strtmp;break;

    case 'mAmbientR': materialAmbient[0] =  temp; break;
    case 'mAmbientG': materialAmbient[1] = temp; break;
    case 'mAmbientB': materialAmbient[2] = temp; break;
    case 'mDiffuseR': materialDiffuse[0] =  temp; materialSpecular[0] = strtmp;
    document.getElementById("mSpecularRSlider").value = strtmp; break;
    case 'mDiffuseG': materialDiffuse[1] =  temp; materialSpecular[1] = strtmp;
    document.getElementById("mSpecularGSlider").value = strtmp;break;
    case 'mDiffuseB': materialDiffuse[2] =  temp; materialSpecular[2] = strtmp;
    document.getElementById("mSpecularBSlider").value = strtmp;break;
    case 'mSpecularR': materialSpecular[0] =  temp; materialDiffuse[0] = strtmp;
    document.getElementById("mDiffuseRSlider").value = strtmp;break;
    case 'mSpecularG': materialSpecular[1] =  temp; materialDiffuse[1] = strtmp;
    document.getElementById("mDiffuseGSlider").value = strtmp;break;
    case 'mSpecularB': materialSpecular[2] =  temp; materialDiffuse[2] = strtmp;
    document.getElementById("mDiffuseBSlider").value = strtmp;break;

    case 'mShin': materialShininess =  temp; break;

    case 'lightX': lightPositionFree[0] =  temp; break;
    case 'lightY': lightPositionFree[1] =  temp; break;
    case 'lightZ': lightPositionFree[2] =  temp; break;

    case 'eyeX': eye[0] = temp; break;
    case 'eyeY': eye[1] = temp; break;
    case 'eyeZ': eye[2] = temp; break;
    case 'atX': at[0] =  temp; break;
    case 'atY': at[1] =  temp; break;
    case 'atZ': at[2] =  temp; break;
    case 'upX': up[0] =  temp; break;
    case 'upY': up[1] =  temp; break;
    case 'upZ': up[2] =  temp; break;



  }

}

var obj = "Teapot";
var isInit = true;
var render = function() {


  if (isInit) {
    initObj();
  }


  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  checkCam();

  gl.uniform1i(gl.getUniformLocation(program, "light1On"), document.getElementById("light1").checked);
  gl.uniform1i(gl.getUniformLocation(program, "light2On"), document.getElementById("light2").checked);
  gl.uniform1i(gl.getUniformLocation(program, "light3On"), document.getElementById("light3").checked);

  switch (obj) {
    case 'Cube':
      drawCube();
      break;
    case 'Dophin':
      drawDophin();
      break;
    case 'Teapot':
      drawTeapot();
      break;
    case 'NTU':
      drawBld();
      break;
  }

  requestAnimFrame(render);


}


function drawDophin() {
  //  if (flag) theta[axis] += 2.0;


     document.getElementById("lighhtLabl1").innerHTML = "[" +lightPosition1Dop +"]"
     document.getElementById("lighhtLabl2").innerHTML = "[" + lightPosition2Dop +"]"
    document.getElementById("lighhtLabl3").innerHTML = "[" +lightPositionFree+ "]"

  projection = projectionDop;
//projection = ortho(-400, 400, -400, 400, -400, 400);
  gl.uniformMatrix4fv( gl.getUniformLocation(program, "projectionMatrix"),
     false, flatten(projection));

  modelView = lookAt(eye,at,up);

  gl.uniformMatrix4fv(gl.getUniformLocation(program, "modelViewMatrix"), false, flatten(modelView));
  gl.uniform4fv(gl.getUniformLocation(program, "lightPosition1"), flatten(lightPosition1Dop));
  gl.uniform4fv(gl.getUniformLocation(program, "lightPosition2"), flatten(lightPosition2Dop));
  gl.uniform4fv(gl.getUniformLocation(program, "lightPosition3"), flatten(lightPositionFree));

  ambientProduct = mult(lightAmbient, ka1);
  diffuseProduct = mult(lightDiffuse, kd1);
  specularProduct = mult(lightSpecular, ks1);
  //checkillumModel();
  gl.uniform4fv(gl.getUniformLocation(program, "ambientProduct"), flatten(ambientProduct));
  gl.uniform4fv(gl.getUniformLocation(program, "diffuseProduct"), flatten(diffuseProduct));
  gl.uniform4fv(gl.getUniformLocation(program, "specularProduct"), flatten(specularProduct));
  gl.uniform1f(gl.getUniformLocation(program, "shininess"), Ns1);

  //gl.drawElements(gl.TRIANGLES, indices_d1.length, gl.UNSIGNED_SHORT, 0);
gl.drawArrays(gl.TRIANGLES, 0, indices_d1.length);

  ambientProduct = mult(lightAmbient, ka2);
  diffuseProduct = mult(lightDiffuse, kd2);
  specularProduct = mult(lightSpecular, ks2);
  //checkillumModel();
  gl.uniform4fv(gl.getUniformLocation(program, "ambientProduct"), flatten(ambientProduct));
  gl.uniform4fv(gl.getUniformLocation(program, "diffuseProduct"), flatten(diffuseProduct));
  gl.uniform4fv(gl.getUniformLocation(program, "specularProduct"), flatten(specularProduct));
  gl.uniform1f(gl.getUniformLocation(program, "shininess"), Ns2);

  //gl.drawElements(gl.TRIANGLES, indices_d2.length, gl.UNSIGNED_SHORT, indices_d1.length * 2);
gl.drawArrays(gl.TRIANGLES, indices_d1.length, indices_d2.length);

  ambientProduct = mult(lightAmbient, ka3);
  diffuseProduct = mult(lightDiffuse, kd3);
  specularProduct = mult(lightSpecular, ks3);
  //checkillumModel();
  gl.uniform4fv(gl.getUniformLocation(program, "ambientProduct"), flatten(ambientProduct));
  gl.uniform4fv(gl.getUniformLocation(program, "diffuseProduct"), flatten(diffuseProduct));
  gl.uniform4fv(gl.getUniformLocation(program, "specularProduct"), flatten(specularProduct));
  gl.uniform1f(gl.getUniformLocation(program, "shininess"), Ns3);

//  gl.drawElements(gl.TRIANGLES, indices_d3.length, gl.UNSIGNED_SHORT, (indices_d1.length + indices_d2.length) * 2);
gl.drawArrays(gl.TRIANGLES, indices_d1.length+indices_d2.length, indices_d3.length);
}

function drawCube() {


  document.getElementById("lighhtLabl1").innerHTML = "[" +lightPosition1Cube +"]"
  document.getElementById("lighhtLabl2").innerHTML = "[" + lightPosition2Cube +"]"
 document.getElementById("lighhtLabl3").innerHTML = "[" +lightPositionFree+ "]"

  if (flag) theta[axis] += 2.0;
  projection = projectionCube;

  gl.uniformMatrix4fv( gl.getUniformLocation(program, "projectionMatrix"),
     false, flatten(projection));

  gl.uniform1f(gl.getUniformLocation(program, "shininess"), materialShininess);

  ambientProduct = mult(lightAmbient, materialAmbient);
  diffuseProduct = mult(lightDiffuse, materialDiffuse);
  specularProduct = mult(lightSpecular, materialSpecular);

  gl.uniform4fv(gl.getUniformLocation(program, "ambientProduct"),
    flatten(ambientProduct));
  gl.uniform4fv(gl.getUniformLocation(program, "diffuseProduct"),
    flatten(diffuseProduct));
  gl.uniform4fv(gl.getUniformLocation(program, "specularProduct"),
    flatten(specularProduct));
  gl.uniform4fv(gl.getUniformLocation(program, "lightPosition1"),
    flatten(lightPosition1Cube));
  gl.uniform4fv(gl.getUniformLocation(program, "lightPosition2"),
    flatten(lightPosition2Cube));
  gl.uniform4fv(gl.getUniformLocation(program, "lightPosition3"),
    flatten(lightPositionFree));

  modelView = mat4();
  modelView = mult(modelView, rotate(theta[xAxis], [1, 0, 0]));
  modelView = mult(modelView, rotate(theta[yAxis], [0, 1, 0]));
  modelView = mult(modelView, rotate(theta[zAxis], [0, 0, 1]));

  gl.uniformMatrix4fv(gl.getUniformLocation(program,
    "modelViewMatrix"), false, flatten(modelView));

  gl.drawArrays(gl.TRIANGLES, dopVert.length, numVertices);

}

function drawTeapot(){


  document.getElementById("lighhtLabl1").innerHTML = "[" +lightPosition1Tea +"]"
  document.getElementById("lighhtLabl2").innerHTML = "[" + lightPosition2Tea +"]"
 document.getElementById("lighhtLabl3").innerHTML = "[" +lightPositionFree+ "]"

  projection = projectionTeapot;

  gl.uniformMatrix4fv( gl.getUniformLocation(program, "projectionMatrix"),
     false, flatten(projection));

  gl.uniform1f(gl.getUniformLocation(program, "shininess"), materialShininess);

  ambientProduct = mult(lightAmbient, materialAmbient);
  diffuseProduct = mult(lightDiffuse, materialDiffuse);
  specularProduct = mult(lightSpecular, materialSpecular);

  gl.uniform4fv(gl.getUniformLocation(program, "ambientProduct"),
    flatten(ambientProduct));
  gl.uniform4fv(gl.getUniformLocation(program, "diffuseProduct"),
    flatten(diffuseProduct));
  gl.uniform4fv(gl.getUniformLocation(program, "specularProduct"),
    flatten(specularProduct));
  gl.uniform4fv(gl.getUniformLocation(program, "lightPosition1"),
    flatten(lightPosition1Tea));
  gl.uniform4fv(gl.getUniformLocation(program, "lightPosition2"),
    flatten(lightPosition2Tea));
  gl.uniform4fv(gl.getUniformLocation(program, "lightPosition3"),
    flatten(lightPositionFree));

  modelView = lookAt(eye,at,up);

  gl.uniformMatrix4fv(gl.getUniformLocation(program,
    "modelViewMatrix"), false, flatten(modelView));

  //gl.drawArrays(gl.TRIANGLES, dopVert.length+numVertices, teapot_model.Vertices.length);
  gl.drawArrays(gl.TRIANGLES, dopVert.length+numVertices, TeapotVerts.length);
}


function drawBld(){

  document.getElementById("lighhtLabl1").innerHTML = "[" +lightPosition1Bld +"]"
  document.getElementById("lighhtLabl2").innerHTML = "[" + lightPosition2Bld +"]"
 document.getElementById("lighhtLabl3").innerHTML = "[" +lightPositionFree+ "]"

  projection = projectionBld;

  gl.uniformMatrix4fv( gl.getUniformLocation(program, "projectionMatrix"),
     false, flatten(projection));

  gl.uniform1f(gl.getUniformLocation(program, "shininess"), materialShininess);

  ambientProduct = mult(lightAmbient, materialAmbient);
  diffuseProduct = mult(lightDiffuse, materialDiffuse);
  specularProduct = mult(lightSpecular, materialSpecular);

  gl.uniform4fv(gl.getUniformLocation(program, "ambientProduct"),
    flatten(ambientProduct));
  gl.uniform4fv(gl.getUniformLocation(program, "diffuseProduct"),
    flatten(diffuseProduct));
  gl.uniform4fv(gl.getUniformLocation(program, "specularProduct"),
    flatten(specularProduct));
  gl.uniform4fv(gl.getUniformLocation(program, "lightPosition1"),
    flatten(lightPosition1Bld));
  gl.uniform4fv(gl.getUniformLocation(program, "lightPosition2"),
    flatten(lightPosition2Bld));
  gl.uniform4fv(gl.getUniformLocation(program, "lightPosition3"),
    flatten(lightPositionFree));

  modelView = lookAt(eye,at,up);

  gl.uniformMatrix4fv(gl.getUniformLocation(program,
    "modelViewMatrix"), false, flatten(modelView));

  gl.drawArrays(gl.TRIANGLES, dopVert.length+numVertices+ TeapotVerts.length, NTU_CSIE_Building.Vertices.length);
}

var sliderMaxLigPos = 30;
var sliderMinLigPos = -30;
var visb = "visible";

function initObj() {

  switch (obj) {
    case 'Cube':
      sliderMaxLigPos = sliderMaxLigPosCube;
      sliderMinLigPos = sliderMinLigPosCube;
      visb = "visible";
      lightPositionFree = lightPositionFreeCube.slice();
      break;
    case 'Dophin':
    sliderMaxLigPos = sliderMaxLigPosDop;
    sliderMinLigPos = sliderMinLigPosDop;
    visb = "hidden";
    lightPositionFree = lightPositionFreeDop.slice();
  break;
    case 'Teapot':
    sliderMaxLigPos = sliderMaxLigPosTeapot;
    sliderMinLigPos = sliderMinLigPosTeapot;
    visb = "visible";
    lightPositionFree = lightPositionFreeTeapot.slice();
    break;
    case 'NTU':
    sliderMaxLigPos = sliderMaxLigPosBld;
    sliderMinLigPos = sliderMinLigPosBld;
    visb = "visible";
    lightPositionFree = lightPositionFreeTeapot.slice();
      break;
  }

  var x = document.getElementsByClassName("slider");
  for (var i = 0; i < x.length; i++) {
    x[i].max = sliderMax;
    x[i].min = sliderMin;
    x[i].value = inits[i];
    x[i].style.width = "100px";
  }
  x = document.getElementsByClassName("sliderMax");
  for (var i = 0; i < x.length; i++) {
    x[i].innerHTML = sliderMax;
    //x[i].style.fontsize = "10%";
  }
  x = document.getElementsByClassName("sliderMin");
  for (var i = 0; i < x.length; i++) {
    x[i].innerHTML = sliderMin;
  }
  isInit = false;


  x = document.getElementsByClassName("sliderLigPos");
  for (var i = 0; i < x.length; i++) {
    x[i].max = sliderMaxLigPos;
    x[i].min = sliderMinLigPos;
    x[i].value = lightPositionFree[i];
  }

  x = document.getElementsByClassName("sliderMaxLigPos");
  for (var i = 0; i < x.length; i++) {
    x[i].innerHTML = sliderMaxLigPos;
    //x[i].style.fontsize = "10%";
  }
  x = document.getElementsByClassName("sliderMinLigPos");
  for (var i = 0; i < x.length; i++) {
    x[i].innerHTML = sliderMinLigPos;
  }
  x = document.getElementsByClassName("material");
  for (var i = 0; i < x.length; i++) {
    x[i].style.visibility = visb;
  }


  x = document.getElementsByClassName("sliderCam");
  for (var i = 0; i < x.length; i++) {
    x[i].max = sliderCamMax;
    x[i].min = sliderCamMin;
    x[i].value = initCam[i];
    x[i].style.width = "100px";
  }
  x = document.getElementsByClassName("sliderCamMax");
  for (var i = 0; i < x.length; i++) {
    x[i].innerHTML = sliderCamMax;
    //x[i].style.fontsize = "10%";
  }
  x = document.getElementsByClassName("sliderCamMin");
  for (var i = 0; i < x.length; i++) {
    x[i].innerHTML = sliderCamMin;
  }

  document.getElementById("lighhtLabl3").innerHTML = "[" +lightPositionFree+ "]"

}


var fac = 1;

function changeView(){
    var viewChange = document.getElementById("changeView").value;
    switch(viewChange){
      case "Front":
      eye = vec3(0,0,fac);
      break;
      case "BLF":
      eye = vec3(-fac,-fac,fac);
      break;
      case "TLF":
      eye = vec3(-fac,fac,fac);
      break;
      case "TRF":
      eye = vec3(fac,fac,fac);
      break;
      case "BRF":
      eye = vec3(fac,-fac,fac);
      break;
      case "BLB":
      eye = vec3(-fac,-fac,-fac);
      break;
      case "TLB":
      eye = vec3(-fac,fac,-fac);
      break;
      case "TRB":
      eye = vec3(fac,fac,-fac);
      break;
      case "BRB":
      eye = vec3(fac,-fac,-fac);
      break;
    }
}


function checkCam() {
  saveat = at;
  var lookatV = subtract(at, eye);
  var upAdj = up.slice();

  if (length(up) == 0) {
    console.warn("up vector cannot be zero in length.");
    up = vec3(0, 1.0, 0);
  }

  if (length(lookatV) == 0) {
    console.warn("look at vector cannot be zero in length.");
    if (eye[2] == 0) {
      at = add(eye, vec3(0, 0, -0.1));
    } else {
      at = add(eye, vec3(0, 0, -0.1));
      if (at[2] <sliderCamMin) {
        at[2] = add(eye, vec3(0, 0, 0.1));
      }
    }
  }

  var dircheck = dot(normalize(lookatV), normalize(upAdj));

  if (Math.abs(dircheck) > 0.99999999 & Math.abs(dircheck) < 1.0000000001) {

    console.warn("up vector cannot be in same direction as look at vector");

    var axis, tf; // tf: rotate about an axis not along lookatV
    if (lookatV[0] != 0 & lookatV[1] == 0 & lookatV[2] == 0) { // along a principle plane
      tf = rotate(10, vec4(0, 1.0, 0, 1.0));
    } else {
      tf = rotate(10, vec4(1.0, 0, 0, 1.0));
    }
    up = multMV(tf, vec4(lookatV)).slice(0, 3);
  }


}
