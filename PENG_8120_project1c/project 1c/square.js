var gl;
var program;
var umvMatrix;
var mvMatrix;
var delay = 100;

var VLine = [];
var CLine = [];
var vBufLine;
var cBufLine;
var VTri = [];
var CTri = [];
var vBufTri;
var cBufTri;
var indTri = [];
var indBufTri;


//var preSize = 90; // initialize buffers with 100 vertices
var preSize = 20; // initialize buffers with 100 vertices

var colorChoice = [0, 0, 1, 1]; // default blue

var canvas;
var colorpickercanvas;

window.onload = function init() {

  canvas = document.getElementById("gl-canvas");
  gl = WebGLUtils.setupWebGL(canvas);
  if (!gl) {
    alert("WebGL isn't available");
  }
  gl.viewport(0, 0, canvas.width, canvas.height);
  gl.clearColor(1.0, 1.0, 1.0, 1.0);


  canvas.onmousedown = canvasMouseDown;
  canvas.onmousemove = canvasMouseMove;
  canvas.onmouseup = canvasMouseUp;

  document.getElementById("DrawLine").onmousedown = drawLine;
  var lineCanvas = document.getElementById('DrawLine');
  var imageline = new Image(); // drawing color picker image
  imageline.onload = function() {
    lineCanvas.getContext('2d').drawImage(imageline, 0, 0, 30, 30);
  }
  imageline.src = 'LineIcon.png';


  document.getElementById("DrawTriangle").onmousedown = drawTriangle;
  var triangleCanvas = document.getElementById('DrawTriangle');
  var imageTriangle = new Image();
  imageTriangle.onload = function() {
    triangleCanvas.getContext('2d').drawImage(imageTriangle, 0, 0, 30, 30);
  }
  imageTriangle.src = 'TriangleIcon.png';


  // Color picker preview button
  document.getElementById("preview").onmousedown = colorpreviewMousedown;
  colorpickercanvas = document.getElementById('pickercanvas');
  document.getElementById('pickerdiv').style.display = 'none';
  document.getElementById('pickerdiv').style.cursor = "crosshair";
  colorpickercanvas.onmousemove = colorpickerMousemove;
  colorpickercanvas.onclick = colorpickerClick;
  var imagecolor = new Image();
  imagecolor.onload = function() {
    colorpickercanvas.getContext('2d').drawImage(imagecolor, 0, 0, imagecolor.width, imagecolor.height);
  }
  imagecolor.src = 'color-picker.png';


  document.getElementById("ClearDrawing").onclick = clearDrawing;
  document.getElementById("PickV").onclick = pickingV;
  document.getElementById("Trans").onclick = transing;
  document.getElementById("Rotate").onclick = rotating;
  document.getElementById("Scale").onclick = scaling;
  document.getElementById("PickB").onclick = pickingB;

  document.getElementById("Delete").onclick = deleting;

  window.onkeydown = windowKeyDown;
  window.onkeyup = windowKeyUp;

  loadShaders();
  initialBuffers();
  render();


};

function loadShaders() {
  //  Load shaders and initialize attribute buffers
  program = initShaders(gl, "vertex-shader", "fragment-shader");
  gl.useProgram(program);
}


var vPosition;
var vColor;

function initialBuffers() {

  vBufLine = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vBufLine);
  gl.bufferData(gl.ARRAY_BUFFER, 8 * preSize, gl.STATIC_DRAW);
  // each vertex is size 8

  vPosition = gl.getAttribLocation(program, "vPosition");
  gl.enableVertexAttribArray(vPosition);

  cBufLine = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, cBufLine);
  gl.bufferData(gl.ARRAY_BUFFER, 16 * preSize, gl.STATIC_DRAW);
  // each vertice color is size 16

  vColor = gl.getAttribLocation(program, "vColor");
  gl.enableVertexAttribArray(vColor);

  vBufTri = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vBufTri);
  gl.bufferData(gl.ARRAY_BUFFER, 8 * preSize, gl.STATIC_DRAW);
  // each vertex is size 8

  cBufTri = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, cBufTri);
  gl.bufferData(gl.ARRAY_BUFFER, 16 * preSize, gl.STATIC_DRAW);
  // each vertice color is size 16

  gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0);
  indBufTri = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indBufTri);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, 8 * preSize, gl.STATIC_DRAW);
  // each triangle needs 3 vertices but 6 indices
  // indices are uint16Array, bytesize = 2 , so buffer size = vertex buffer

  vBufLine.numItems = 0;
  vBufTri.numItems = 0; // number of points
  indBufTri.numItems = 0;

  umvMatrix = gl.getUniformLocation(program, 'umvMatrix');
}

//----------------------------------------------------------------------------
function updateLineBuffers(offset, newVertex, newColor) {
  gl.bindBuffer(gl.ARRAY_BUFFER, vBufLine);
  gl.bufferSubData(gl.ARRAY_BUFFER, offset * 8, flatten(newVertex));
  gl.bindBuffer(gl.ARRAY_BUFFER, cBufLine);
  gl.bufferSubData(gl.ARRAY_BUFFER, offset * 16, flatten(newColor));
}
//----------------------------------------------------------------------------
function updateTriangleBuffers(offset, newVertex, newColor, indexoffset, newIndex) {
  gl.bindBuffer(gl.ARRAY_BUFFER, vBufTri);
  gl.bufferSubData(gl.ARRAY_BUFFER, offset * 8, flatten(newVertex));
  gl.bindBuffer(gl.ARRAY_BUFFER, cBufTri);
  gl.bufferSubData(gl.ARRAY_BUFFER, offset * 16, flatten(newColor));
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indBufTri);
  gl.bufferSubData(gl.ELEMENT_ARRAY_BUFFER, indexoffset * 2, new Uint16Array(newIndex));
}


//----------------------------------------------------------------------------
function render() {
  gl.clear(gl.COLOR_BUFFER_BIT);
  loadWorldSize();
  gl.uniformMatrix4fv(umvMatrix, false, flatten(mvMatrix));

  if (vBufLine.numItems > 0) { // if 0, there will be count warning
    gl.bindBuffer(gl.ARRAY_BUFFER, vBufLine);
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
    gl.bindBuffer(gl.ARRAY_BUFFER, cBufLine);
    gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0);
    gl.drawArrays(gl.POINTS, 0, vBufLine.numItems); //put points at clicked poisition
    gl.drawArrays(gl.LINES, 0, vBufLine.numItems);
    // If odd number of points, the last line will not be drawn
  }

  if (vBufTri.numItems > 0) { // if 0, there will be count warning
    gl.bindBuffer(gl.ARRAY_BUFFER, vBufTri);
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
    gl.bindBuffer(gl.ARRAY_BUFFER, cBufTri);
    gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0);
    gl.drawArrays(gl.POINTS, 0, vBufTri.numItems); //points at clicked poisition
    if (document.getElementById('trianglefill').checked) {
      gl.drawArrays(gl.TRIANGLES, 0, vBufTri.numItems);
      // If number of points is not times of 3, the last triangle will not be drawn
    } else { // not filled triangles
      gl.drawElements(gl.LINES, indBufTri.numItems, gl.UNSIGNED_SHORT, 0);
    }
  }

  requestAnimFrame(render);
}




var mouseDown = false;
var worldSize;
//var highlightcolor = [1, 0, 0, 0.2]; // default red
var pickVLine = []; // Save selected vertex indices
var pickVTri = [];
//var CLineSaved = []; // Save original colors for de-select
var VLineSaved = []; // Save original vertices for transformation
//var CTriangleSaved = [];
var VTriSaved = [];
var tfCanvastoWorld;

//----------------------------------------------------------------------------
function loadWorldSize() {
  var worldRange = [parseFloat(document.getElementById("leftVal").value),
    parseFloat(document.getElementById("rightVal").value),
    parseFloat(document.getElementById("btmVal").value),
    parseFloat(document.getElementById("topVal").value)
  ];
  worldSize = [worldRange[1] - worldRange[0], worldRange[3] - worldRange[2]];
  tfCanvastoWorld = mult(translate(worldRange[0], worldRange[3], 0), mult(scale(worldSize[0] / canvas.width, -worldSize[1] / canvas.height, 1), translate(0, 0, 0)));
  mvMatrix = mult(translate(-1, 1, 0), mult(scale(2 / worldSize[0], 2 / worldSize[1], 1), translate(-worldRange[0], -worldRange[3], 0)));
}



//----------------------------------------------------------------------------
var pickwindow;

function canvasMouseDown(event) {
  mouseDown = true;
  var rect = canvas.getBoundingClientRect();
  var pcanvas = vec4(event.clientX - rect.left - 1, event.clientY - rect.top - 1, 0, 1);
  var pWorld = multMV(tfCanvastoWorld, pcanvas);

  // check if Ctrl is on
  if (!controlpressed & (onpickV || onpickB || ondrawLine || ondrawTriangle)) { // if not on, return all previous chosen object to original color
    for (var i = 0; i < pickVLine.length; i++) {
      //CLine[pickVLine[i]] = CLineSaved[i];

      updateLineBuffers(pickVLine[i], [], CLine[pickVLine[i]]);
    }
    pickVLine = [];
    //CLineSaved = [];
    VLineSaved = [];
    for (var i = 0; i < pickVTri.length; i++) {
      //  CTri[pickVTri[i]] = CTriangleSaved[i];

      updateTriangleBuffers(pickVTri[i], [], CTri[pickVTri[i]], 0, []);
    }

    pickVTri = [];
    //CTriangleSaved = [];
    VTriSaved = [];
    pickwindow = [];
  }

  // Line
  if (ondrawLine) {
    linePush(vec2(pWorld[0], pWorld[1]), colorChoice);
    //Traignle
  } else if (ondrawTriangle) {
    trianglePush(vec2(pWorld[0], pWorld[1]), colorChoice);

  } else if (onpickV) { // if on picking task

    // for picked object, save all current vertices and vertex colors
    // change the vertex colors to the highlight color
    // If the object is de-selected, change back to the original color
    pickwindow = [pWorld[0] - Math.abs(worldSize[0]) / 50, pWorld[0] + Math.abs(worldSize[0]) / 50, pWorld[1] - Math.abs(worldSize[1]) / 50, pWorld[1] + Math.abs(worldSize[1]) / 50]; // size of the square region for picking a vertex, in NDC
    Pick();

  } else if (ontranslate || onrotate || onscale || onpickB) {} else {
    alert("Please choose primitive to draw.");
  }

  // update saved data
  updateSavedData();
  lastPos = pWorld;
};



//----------------------------------------------------------------------------
function Pick() {



  for (var i = 0; i < VLine.length; i++) { // search in the vertices vector of line

    if (VLine[i][0] > pickwindow[0] && VLine[i][0] < pickwindow[1] && VLine[i][1] > pickwindow[2] && VLine[i][1] < pickwindow[3]) { //vertex in the preset square around selected point
      var isexist = false;
      for (var j = 0; j < pickVLine.length; j++) {
        if (pickVLine[j] == i)
          isexist = true;
      }
      if (!isexist) {
        if (i % 2 == 0) { // even index, the object contains the point after it
          pickVLine.push(i, i + 1);
        } else { // odd index, the object contains the point before it
          pickVLine.push(i - 1, i);
        }

        lastVertex = VLine[i];
      }
    }
  }

  for (var i = 0; i < pickVLine.length; i++) {
    console.log(i + ',   ' + pickVLine.length);
    var highlightcolor = CLine[pickVLine[i]].slice(0, 3).concat(0.5);
    updateLineBuffers(pickVLine[i], [], highlightcolor);
  }

  for (var i = 0; i < VTri.length; i++) { // search in the vertices vector of triangle
    if (VTri[i][0] > pickwindow[0] && VTri[i][0] < pickwindow[1] && VTri[i][1] > pickwindow[2] && VTri[i][1] < pickwindow[3]) { //vertex in the preset square around selected point
      var isexist = false;
      for (var j = 0; j < pickVTri.length; j++) {
        if (pickVTri[j] == i)
          isexist = true;
      }
      if (!isexist) {
        if (i % 3 == 0) {
          pickVTri.push(i, i + 1, i + 2);
        } else if (i % 3 == 1) {
          pickVTri.push(i - 1, i, i + 1);
        } else {
          pickVTri.push(i - 2, i - 1, i);
        }
        lastVertex = VTri[i];
      }
    }
  }

  //console.log('before,   '+CTri);
  //console.log(' '+VTri);
  //console.log(' '+pickVTri);
  for (var i = 0; i < pickVTri.length; i++) {
    var highlightcolor = CTri[pickVTri[i]].slice(0, 3).concat(0.5);
    updateTriangleBuffers(pickVTri[i], [], highlightcolor, 0, []);
  }

}



//----------------------------------------------------------------------------
function updateSavedData() {
  for (var i = 0; i < pickVLine.length; i++) {
    //  CLineSaved[i] = CLine[pickVLine[i]];
    VLineSaved[i] = VLine[pickVLine[i]];
  }
  for (var i = 0; i < pickVTri.length; i++) {
    //CTriangleSaved[i] = CTri[pickVTri[i]];
    VTriSaved[i] = VTri[pickVTri[i]];
  }
};



//----------------------------------------------------------------------------
var lastVertex = [];
var lastPos = [];

function canvasMouseMove(event) {

  var rect = canvas.getBoundingClientRect();
  var pcanvas = vec4(event.clientX - rect.left - 1, event.clientY - rect.top - 1, 0, 1);
  var pWorldMove = multMV(tfCanvastoWorld, pcanvas);
  document.getElementById('MouseCSYWorld').innerHTML = pWorldMove[0] + ',' + pWorldMove[1];

  if ((onpickB) && mouseDown) {
    pickwindow = [Math.min(lastPos[0], pWorldMove[0]), Math.max(lastPos[0], pWorldMove[0]), Math.min(lastPos[1], pWorldMove[1]), Math.max(lastPos[1], pWorldMove[1])];
    Pick();
    updateSavedData();
  }

  if ((onpickV || ontranslate) && mouseDown) { // if picking is on, follow the mouse position with drag // Incremental

    var tftrans = translate(pWorldMove[0] - lastVertex[0], pWorldMove[1] - lastVertex[1], 0, 1);
    //  var lastVtxtemp = multMV(tftrans, vec4(lastVertex));
    lastVertex = vec2(pWorldMove[0], pWorldMove[1]);
    for (var i = 0; i < pickVLine.length; i++) {
      var vtemp_old = vec4(VLine[pickVLine[i]]); // update on the updated vertices
      var vtemp_new = multMV(tftrans, vtemp_old);
      VLine[pickVLine[i]] = vec2(vtemp_new[0], vtemp_new[1]);
      updateLineBuffers(pickVLine[i], vec2(vtemp_new[0], vtemp_new[1]), []);
    }
    for (var i = 0; i < pickVTri.length; i++) {
      var vtemp_old = vec4(VTri[pickVTri[i]]);
      var vtemp_new = multMV(tftrans, vtemp_old);
      VTri[pickVTri[i]] = vec2(vtemp_new[0], vtemp_new[1]);
      updateTriangleBuffers(pickVTri[i], vec2(vtemp_new[0], vtemp_new[1]), [], 0, []);
    }
  }

  if (onrotate && mouseDown) {
    var axis = [0, 0, 1]; // rotate around z axis
    var angle = -(pWorldMove[0] - lastPos[0]) * 2 * 360 / Math.abs(worldSize[0]); // deg, NDC 1 = 3 cycles, horozontally to the left is CCW
    var tftrans = translate(-lastVertex[0], -lastVertex[1], 0, 1);
    var tftransRV = translate(lastVertex[0], lastVertex[1], 0, 1); // reverse
    var tfrot = rotate(angle, axis);
    for (var i = 0; i < pickVLine.length; i++) {
      var vtemp_old = vec4(VLineSaved[i]); // update on the original vertices
      var vtemp_new = multMV(mult(tftransRV, mult(tfrot, tftrans)), vtemp_old);
      VLine[pickVLine[i]] = vec2(vtemp_new[0], vtemp_new[1]);
      updateLineBuffers(pickVLine[i], vec2(vtemp_new[0], vtemp_new[1]), []);
    }
    for (var i = 0; i < pickVTri.length; i++) {
      var vtemp_old = vec4(VTriSaved[i]);
      var vtemp_new = multMV(mult(tftransRV, mult(tfrot, tftrans)), vtemp_old);
      VTri[pickVTri[i]] = vec2(vtemp_new[0], vtemp_new[1]);
      updateTriangleBuffers(pickVTri[i], vec2(vtemp_new[0], vtemp_new[1]), [], 0, []);
    }
  }

  if (onscale && mouseDown) {
    var scalex = 1;
    var scaley = 1;
    var tftrans = [];
    tftrans = translate(-lastVertex[0], -lastVertex[1], 0, 1);
    tftransRV = translate(lastVertex[0], lastVertex[1], 0, 1); // reverse
    if (pWorldMove[0] > lastPos[0]) { // scale up
      scalex = 1 + (pWorldMove[0] - lastPos[0]) / (Math.abs(worldSize[0]) / 2 - lastPos[0]) * 5; // maximum scale is 5, when mouse reaches right edge
    } else { // scale down
      scalex = 1.01 + (pWorldMove[0] - lastPos[0]) / (lastPos[0] + Math.abs(worldSize[0]) / 2); // minimum scale is 0.01, when mouse reaches left edge
    }
    if (pWorldMove[1] > lastPos[1]) { // scale up
      scaley = 1 + (pWorldMove[1] - lastPos[1]) / (Math.abs(worldSize[1]) / 2 - lastPos[1]) * 5; // maximum scale is 5, when mouse reaches right edge
    } else { // scale down
      scaley = 1.01 + (pWorldMove[1] - lastPos[1]) / (lastPos[1] + Math.abs(worldSize[1]) / 2); // minimum scale is 0.01, when mouse reaches left edge
    }
    var tfscale = scale(scalex, scaley, 1); // scale in both x and y direction

    for (var i = 0; i < pickVLine.length; i++) {
      var vtemp_old = vec4(VLineSaved[i]); // update on the original vertices
      var vtemp_new = multMV(mult(tftransRV, mult(tfscale, tftrans)), vtemp_old);
      VLine[pickVLine[i]] = vec2(vtemp_new[0], vtemp_new[1]);
      updateLineBuffers(pickVLine[i], vec2(vtemp_new[0], vtemp_new[1]), []);
    }
    for (var i = 0; i < pickVTri.length; i++) {
      var vtemp_old = vec4(VTriSaved[i]);
      var vtemp_new = multMV(mult(tftransRV, mult(tfscale, tftrans)), vtemp_old);
      VTri[pickVTri[i]] = vec2(vtemp_new[0], vtemp_new[1]);
      updateTriangleBuffers(pickVTri[i], vec2(vtemp_new[0], vtemp_new[1]), [], 0, []);
    }
  }


};


//----------------------------------------------------------------------------
var bCanPreview = true; // can preview

function colorpickerMousemove(event) {
  if (bCanPreview) {
    // get coordinates of current position
    var canvastemp = document.getElementById("pickercanvas");
    var canvasX = Math.floor(event.pageX - canvastemp.offsetLeft);
    var canvasY = Math.floor(event.pageY - canvastemp.offsetTop);
    // get current pixel
    var ctx = canvastemp.getContext('2d');
    var imageData = ctx.getImageData(canvasX, canvasY, 1, 1);
    var pixel = imageData.data;
    // update preview color
    var pixelColor = "rgb(" + pixel[0] + ", " + pixel[1] + ", " + pixel[2] + ")";
    document.getElementById("preview").style.backgroundColor = pixelColor;
    var colordisp = [pixel[0] / 255, pixel[1] / 255, pixel[2] / 255, 1];
  }
};



//----------------------------------------------------------------------------
function colorpickerClick() {
  var canvastemp = document.getElementById("pickercanvas");
  var canvasX = Math.floor(event.pageX - canvastemp.offsetLeft);
  var canvasY = Math.floor(event.pageY - canvastemp.offsetTop);
  // get current pixel
  var ctx = canvastemp.getContext('2d');
  var imageData = ctx.getImageData(canvasX, canvasY, 1, 1);
  var pixel = imageData.data;
  // update preview color
  var pixelColor = "rgb(" + pixel[0] + ", " + pixel[1] + ", " + pixel[2] + ")";
  document.getElementById("preview").style.backgroundColor = pixelColor;
  colorChoice = [pixel[0] / 255, pixel[1] / 255, pixel[2] / 255, 1];
  bCanPreview = !bCanPreview;

  var colorChoicetemp = colorChoice.slice(0, 3).concat(0.5);
  for (var i = 0; i < pickVLine.length; i++) {
    CLine[pickVLine[i]] = colorChoice;
    updateLineBuffers(pickVLine[i], [], colorChoicetemp);
  }

  for (var i = 0; i < pickVTri.length; i++) {
    CTri[pickVTri[i]] = colorChoice;
    updateTriangleBuffers(pickVTri[i], [], colorChoicetemp, 0, []);
  }


}


//----------------------------------------------------------------------------
function colorpreviewMousedown() {
  disp = document.getElementById("pickerdiv");
  if (disp.style.display === 'none') {
    disp.style.display = 'block';
    bCanPreview = true;
  } else {
    disp.style.display = 'none';
    bCanPreview = false;
  }

}


//----------------------------------------------------------------------------
function clearDrawing() {
  VLine = [];
  CLine = [];
  VTri = [];
  CTri = [];
  indTri = [];
  vBufLine.numItems = 0;
  vBufTri.numItems = 0; // number of points
  indBufTri.numItems = 0;
  switches('');
};



//----------------------------------------------------------------------------
var ondrawLine = false;
var ondrawTriangle = false;
var onpickV = false;
var ontranslate = false;
var onrotate = false;
var onscale = false;
var onpickB = false;

function switches(key) {
  ondrawLine = false;
  ondrawTriangle = false;
  onpickV = false;
  ontranslate = false;
  onrotate = false;
  onscale = false;
  onpickB = false;

  switch (key) {
    case 'ondrawLine':
      ondrawLine = true;
      break;
    case 'ondrawTriangle': // ctrl
      ondrawTriangle = true;
      break;
    case 'onpickV': // ctrl
      onpickV = true;
      break;
    case 'ontranslate': // ctrl
      ontranslate = true;
      break;
    case 'onrotate': // ctrl
      onrotate = true;
      break;
    case 'onscale': // ctrl
      onscale = true;
      break;
    case 'onpickB': // ctrl
      onpickB = true;
      break;
  };
};

function drawLine() {
  switches('ondrawLine');
};

function drawTriangle() {
  switches('ondrawTriangle');
};

function pickingV() {
  switches('onpickV');
  updateSavedData();
};

function pickingB() {
  switches('onpickB');
  updateSavedData();
};

function transing() {
  switches('ontranslate');
  updateSavedData();
};

function rotating() {
  switches('onrotate');
  updateSavedData();
};

function scaling() {
  switches('onscale');
  updateSavedData();
};


var controlpressed = false;

function windowKeyDown(event) {
  //  console.log(event.keyCode);
  switch (event.keyCode) {
    case 87: // w, picking by vertex
      pickingV();
      break;
    case 84: // t, translation
      transing();
      break;
    case 82: // r, rotate by vertex
      rotating();
      break;
    case 69: // e, scale by vertex
      scaling();
      break;
    case 65: // a, picking by Box
      pickingB();
      break;
    case 17: // ctrl
      controlpressed = true;
      break;
    case 68: // d delete
      deleting();
      break;
  };
};

function windowKeyUp(event) {
  switch (event.keyCode) {
    case 17: //ctrl
      controlpressed = false;
      break;
  }
};

function canvasMouseUp(event) {
  mouseDown = false;
};


//---------------------------------------------------------------------------------------
var delLine = [];
var delTri = [];

function deleting() {
  var tftrans = translate(-100000, -100000, 0, 1); // transform far out of worldCSY
  for (var i = 0; i < pickVLine.length; i++) {
    var vtemp_old = vec4(VLine[pickVLine[i]]); // update on the original vertices
    var vtemp_new = multMV(tftrans, vtemp_old);
    VLine[pickVLine[i]] = vec2(vtemp_new[0], vtemp_new[1]);
    updateLineBuffers(pickVLine[i], vec2(vtemp_new[0], vtemp_new[1]), []);
    delLine.push(pickVLine[i]);
  }

  for (var i = 0; i < pickVTri.length; i++) {
    var vtemp_old = vec4(VTri[pickVTri[i]]);
    var vtemp_new = multMV(tftrans, vtemp_old);
    VTri[pickVTri[i]] = vec2(vtemp_new[0], vtemp_new[1]);
    updateTriangleBuffers(pickVTri[i], vec2(vtemp_new[0], vtemp_new[1]), [], 0, []);
    delTri.push(pickVTri[i]);
  }
  document.getElementById('DelPos').innerHTML = '[' + delLine + '],[' + delTri + ']';
}


//---------------------------------------------------------------------------------------

function linePush(newVertex, newColor) {
  if (delLine.length > 0) { // there are deleted slots
    VLine[delLine[0]] = newVertex;
    CLine[delLine[0]] = newColor;
    if (delLine[0] % 2 == 1) {
      updateLineBuffers(delLine[0] - 1, [VLine[delLine[0] - 1], VLine[delLine[0]]], [CLine[delLine[0] - 1], CLine[delLine[0]]]);
      document.getElementById('InsertPos').innerHTML = [delLine[0] - 1, delLine.shift()];
    } else {
      delLine.shift()
    }

  } else {
    if (VLine.length >= preSize) { // the preset size of buffer could be changed
      // if overflow, do not increase points, change the last vertex
      alert("Too many vertices, replacing last vertex");
      VLine.pop()
      CLine.pop(); //index is the same
    }
    VLine.push(newVertex);
    CLine.push(colorChoice);
    updateLineBuffers(VLine.length - 1, newVertex, newColor);
    document.getElementById('InsertPos').innerHTML = VLine.length - 1;
  }
  vBufLine.numItems = VLine.length; // number of points
  document.getElementById('DelPos').innerHTML = '[' + delLine + '],[' + delTri + ']';
}



//---------------------------------------------------------------------------------------


function trianglePush(newVertex, newColor) {
  if (delTri.length > 0) { // there are deleted slots
    VTri[delTri[0]] = newVertex;
    CTri[delTri[0]] = newColor;
    if (delTri[0] % 3 == 2) {
      updateTriangleBuffers(delTri[0] - 2, [VTri[delTri[0] - 2], VTri[delTri[0] - 1], VTri[delTri[0]]], [CTri[delTri[0] - 2], CTri[delTri[0] - 1], CTri[delTri[0]]], 0, []);
      document.getElementById('InsertPos').innerHTML = [delTri[0] - 2, delTri[0] - 1, delTri.shift()];
    } else {
      delTri.shift()
    }

  } else {
    if (VTri.length >= preSize) { // if overflow, do not increase points, change the last vertex
      alert("Too many vertices, replacing last vertex");
      VTri.pop();
      CTri.pop(); //index is the same
    }
    VTri.push(newVertex);
    CTri.push(colorChoice);
    updateTriangleBuffers(VTri.length - 1, newVertex, newColor, 0, []);
    document.getElementById('InsertPos').innerHTML = VTri.length - 1;
  }

  // update indices for plotting unfilled triangles
  if ((VTri.length - 1) % 3 == 0 || (VTri.length - 1) % 3 == 1) {
    indTri.push(VTri.length - 1);
    updateTriangleBuffers(0, [], [], indTri.length - 1, [VTri.length - 1]); // Update only when three more points are added -> a triangle
  } else if ((VTri.length - 1) % 3 == 2) {
    indTri.push(VTri.length - 2, VTri.length - 1, VTri.length - 1, VTri.length - 3);
    updateTriangleBuffers(0, [], [], indTri.length - 4, [VTri.length - 2, VTri.length - 1, VTri.length - 1, VTri.length - 3]); // Update only when three more points are added -> a triangle
  }
  vBufTri.numItems = VTri.length; // number of points
  indBufTri.numItems = indTri.length;
  document.getElementById('DelPos').innerHTML = '[' + delLine + '],[' + delTri + ']';

}
