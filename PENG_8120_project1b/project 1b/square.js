var gl;
var program;
var umvMatrix;
var mvMatrix;
var delay = 100;

var verticesLine = [];
var vertexColorsLine = [];
var vBufferLine;
var cBufferLine;
var verticesTriangle = [];
var vertexColorsTriangle = [];
var vBufferTriangle;
var cBufferTriangle;
var indicesTriangle = [];
var indexBufferTriangle;


var preSize = 90; // initialize buffers with 100 vertices

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

  vBufferLine = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vBufferLine);
  gl.bufferData(gl.ARRAY_BUFFER, 8 * preSize, gl.STATIC_DRAW);
  // each vertex is size 8

  vPosition = gl.getAttribLocation(program, "vPosition");
  gl.enableVertexAttribArray(vPosition);

  cBufferLine = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, cBufferLine);
  gl.bufferData(gl.ARRAY_BUFFER, 16 * preSize, gl.STATIC_DRAW);
  // each vertice color is size 16

  vColor = gl.getAttribLocation(program, "vColor");
  gl.enableVertexAttribArray(vColor);

  vBufferTriangle = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vBufferTriangle);
  gl.bufferData(gl.ARRAY_BUFFER, 8 * preSize, gl.STATIC_DRAW);
  // each vertex is size 8

  cBufferTriangle = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, cBufferTriangle);
  gl.bufferData(gl.ARRAY_BUFFER, 16 * preSize, gl.STATIC_DRAW);
  // each vertice color is size 16

  gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0);
  indexBufferTriangle = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBufferTriangle);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, 8 * preSize, gl.STATIC_DRAW);
  // each triangle needs 3 vertices but 6 indices
  // indices are uint16Array, bytesize = 2 , so buffer size = vertex buffer

  vBufferLine.numItems = 0;
  vBufferTriangle.numItems = 0; // number of points
  indexBufferTriangle.numItems = 0;

  umvMatrix = gl.getUniformLocation(program, 'umvMatrix');
}

//----------------------------------------------------------------------------
function updateLineBuffers(offset, newVertex, newColor) {
  gl.bindBuffer(gl.ARRAY_BUFFER, vBufferLine);
  gl.bufferSubData(gl.ARRAY_BUFFER, offset * 8, flatten(newVertex));
  gl.bindBuffer(gl.ARRAY_BUFFER, cBufferLine);
  gl.bufferSubData(gl.ARRAY_BUFFER, offset * 16, flatten(newColor));
}
//----------------------------------------------------------------------------
function updateTriangleBuffers(offset, newVertex, newColor, indexoffset, newIndex) {
  gl.bindBuffer(gl.ARRAY_BUFFER, vBufferTriangle);
  gl.bufferSubData(gl.ARRAY_BUFFER, offset * 8, flatten(newVertex));
  gl.bindBuffer(gl.ARRAY_BUFFER, cBufferTriangle);
  gl.bufferSubData(gl.ARRAY_BUFFER, offset * 16, flatten(newColor));
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBufferTriangle);
  gl.bufferSubData(gl.ELEMENT_ARRAY_BUFFER, indexoffset * 2, new Uint16Array(newIndex));
}


//----------------------------------------------------------------------------
function render() {
  gl.clear(gl.COLOR_BUFFER_BIT);
  loadWorldSize();
  gl.uniformMatrix4fv(umvMatrix, false, flatten(mvMatrix));

  if (vBufferLine.numItems > 0) { // if 0, there will be count warning
    gl.bindBuffer(gl.ARRAY_BUFFER, vBufferLine);
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
    gl.bindBuffer(gl.ARRAY_BUFFER, cBufferLine);
    gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0);
    gl.drawArrays(gl.POINTS, 0, vBufferLine.numItems); //put points at clicked poisition
    gl.drawArrays(gl.LINES, 0, vBufferLine.numItems);
    // If odd number of points, the last line will not be drawn
  }

  if (vBufferTriangle.numItems > 0) { // if 0, there will be count warning
    gl.bindBuffer(gl.ARRAY_BUFFER, vBufferTriangle);
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
    gl.bindBuffer(gl.ARRAY_BUFFER, cBufferTriangle);
    gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0);
    gl.drawArrays(gl.POINTS, 0, vBufferTriangle.numItems); //points at clicked poisition
    if (document.getElementById('trianglefill').checked) {
      gl.drawArrays(gl.TRIANGLES, 0, vBufferTriangle.numItems);
      // If number of points is not times of 3, the last triangle will not be drawn
    } else { // not filled triangles
      gl.drawElements(gl.LINES, indexBufferTriangle.numItems, gl.UNSIGNED_SHORT, 0);
    }
  }

  requestAnimFrame(render);
}




var mouseDown = false;
var worldSize;
var highlightcolor = [1, 0, 0, 1]; // default red
var pickVTLine = []; // Save selected vertex indices
var pickVTTriangle = [];
var VCLineSaved = []; // Save original colors for de-select
var VTLineSaved = []; // Save original vertices for transformation
var VCTriangleSaved = [];
var VTTriangleSaved = [];
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
    for (var i = 0; i < pickVTLine.length; i++) {
      vertexColorsLine[pickVTLine[i]] = VCLineSaved[i];
      updateLineBuffers(pickVTLine[i], [], VCLineSaved[i]);
    }
    pickVTLine = [];
    VCLineSaved = [];
    VTLineSaved = [];
    for (var i = 0; i < pickVTTriangle.length; i++) {
      vertexColorsTriangle[pickVTTriangle[i]] = VCTriangleSaved[i];
      updateTriangleBuffers(pickVTTriangle[i], [], VCTriangleSaved[i], 0, []);
    }
    pickVTTriangle = [];
    VCTriangleSaved = [];
    VTTriangleSaved = [];
    pickwindow = [];
  }

  // Line
  if (ondrawLine) {

    if (verticesLine.length < preSize) { // the preset size of buffer could be changed
      verticesLine.push(vec2(pWorld[0], pWorld[1]));
      vertexColorsLine.push(colorChoice);
      vBufferLine.numItems = verticesLine.length; // number of points
      updateLineBuffers(verticesLine.length - 1, vec2(pWorld[0], pWorld[1]), colorChoice);
    } else { // if overflow, do not increase points, change the last vertex
      alert("Too many vertices, replacing last vertex");
      verticesLine.pop()
      vertexColorsLine.pop(); //index is the same
      verticesLine.push(vec2(pWorld[0], pWorld[1]));
      vertexColorsLine.push(colorChoice);
      updateLineBuffers(verticesLine.length - 1, vec2(pWorld[0], pWorld[1]), colorChoice); // Update only when two more points are added -> a line
    }

    //Traignle
  } else if (ondrawTriangle) {

    if (verticesTriangle.length < preSize) { // the preset size of buffer could be changed
      verticesTriangle.push(vec2(pWorld[0], pWorld[1]));
      vertexColorsTriangle.push(colorChoice);

      // update indices for plotting unfilled triangles
      if ((verticesTriangle.length - 1) % 3 == 0 || (verticesTriangle.length - 1) % 3 == 1) {
        indicesTriangle.push(verticesTriangle.length - 1);
        updateTriangleBuffers(verticesTriangle.length - 1, vec2(pWorld[0], pWorld[1]), colorChoice, indicesTriangle.length - 1, [verticesTriangle.length - 1]); // Update only when three more points are added -> a triangle
      } else if ((verticesTriangle.length - 1) % 3 == 2) {
        indicesTriangle.push(verticesTriangle.length - 2, verticesTriangle.length - 1, verticesTriangle.length - 1, verticesTriangle.length - 3);
        updateTriangleBuffers(verticesTriangle.length - 1, vec2(pWorld[0], pWorld[1]), colorChoice, indicesTriangle.length - 4, [verticesTriangle.length - 2, verticesTriangle.length - 1, verticesTriangle.length - 1, verticesTriangle.length - 3]); // Update only when three more points are added -> a triangle
      }
      vBufferTriangle.numItems = verticesTriangle.length; // number of points
      indexBufferTriangle.numItems = indicesTriangle.length;
    } else { // if overflow, do not increase points, change the last vertex
      alert("Too many vertices, replacing last vertex");
      verticesTriangle.pop();
      vertexColorsTriangle.pop(); //index is the same
      verticesTriangle.push(vec2(pWorld[0], pWorld[1]));
      vertexColorsTriangle.push(colorChoice);
      updateTriangleBuffers(verticesTriangle.length - 1, vec2(pWorld[0], pWorld[1]), colorChoice, indicesTriangle.length, []); // Update only when three more points are added -> a triangle
    }


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
  for (var i = 0; i < verticesLine.length; i++) { // search in the vertices vector of line

    if (verticesLine[i][0] > pickwindow[0] && verticesLine[i][0] < pickwindow[1] && verticesLine[i][1] > pickwindow[2] && verticesLine[i][1] < pickwindow[3]) { //vertex in the preset square around selected point
      var isexist = false;
      for (var j = 0; j < pickVTLine.length; j++) {
        if (pickVTLine[j] == i)
          isexist = true;
      }
      if (!isexist) {
        if (i % 2 == 0) { // even index, the object contains the point after it
          pickVTLine.push(i, i + 1);
        } else { // odd index, the object contains the point before it
          pickVTLine.push(i - 1, i);
        }

        lastVertex = verticesLine[i];
      }
    }
  }

  for (var i = 0; i < pickVTLine.length; i++) {
    updateLineBuffers(pickVTLine[i], [], highlightcolor);
  }

  for (var i = 0; i < verticesTriangle.length; i++) { // search in the vertices vector of triangle
    if (verticesTriangle[i][0] > pickwindow[0] && verticesTriangle[i][0] < pickwindow[1] && verticesTriangle[i][1] > pickwindow[2] && verticesTriangle[i][1] < pickwindow[3]) { //vertex in the preset square around selected point
      var isexist = false;
      for (var j = 0; j < pickVTTriangle.length; j++) {
        if (pickVTTriangle[j] == i)
          isexist = true;
      }
      if (!isexist) {
        if (i % 3 == 0) {
          pickVTTriangle.push(i, i + 1, i + 2);
        } else if (i % 3 == 1) {
          pickVTTriangle.push(i - 1, i, i + 1);
        } else {
          pickVTTriangle.push(i - 2, i - 1, i);
        }
        lastVertex = verticesTriangle[i];
      }
    }
  }

  for (var i = 0; i < pickVTTriangle.length; i++) {
    updateTriangleBuffers(pickVTTriangle[i], [], highlightcolor, 0, []);
  }

}



//----------------------------------------------------------------------------
function updateSavedData() {
  for (var i = 0; i < pickVTLine.length; i++) {
    VCLineSaved[i] = vertexColorsLine[pickVTLine[i]];
    VTLineSaved[i] = verticesLine[pickVTLine[i]];
  }
  for (var i = 0; i < pickVTTriangle.length; i++) {
    VCTriangleSaved[i] = vertexColorsTriangle[pickVTTriangle[i]];
    VTTriangleSaved[i] = verticesTriangle[pickVTTriangle[i]];
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
    for (var i = 0; i < pickVTLine.length; i++) {
      var vtemp_old = vec4(verticesLine[pickVTLine[i]]); // update on the updated vertices
      var vtemp_new = multMV(tftrans, vtemp_old);
      verticesLine[pickVTLine[i]] = vec2(vtemp_new[0], vtemp_new[1]);
      updateLineBuffers(pickVTLine[i], vec2(vtemp_new[0], vtemp_new[1]), []);
    }
    for (var i = 0; i < pickVTTriangle.length; i++) {
      var vtemp_old = vec4(verticesTriangle[pickVTTriangle[i]]);
      var vtemp_new = multMV(tftrans, vtemp_old);
      verticesTriangle[pickVTTriangle[i]] = vec2(vtemp_new[0], vtemp_new[1]);
      updateTriangleBuffers(pickVTTriangle[i], vec2(vtemp_new[0], vtemp_new[1]), [], 0, []);
    }
  }

  if (onrotate && mouseDown) {
    var axis = [0, 0, 1]; // rotate around z axis
    var angle = -(pWorldMove[0] - lastPos[0]) * 2 * 360 / Math.abs(worldSize[0]); // deg, NDC 1 = 3 cycles, horozontally to the left is CCW
    var tftrans = translate(-lastVertex[0], -lastVertex[1], 0, 1);
    var tftransRV = translate(lastVertex[0], lastVertex[1], 0, 1); // reverse
    var tfrot = rotate(angle, axis);
    for (var i = 0; i < pickVTLine.length; i++) {
      var vtemp_old = vec4(VTLineSaved[i]); // update on the original vertices
      var vtemp_new = multMV(mult(tftransRV, mult(tfrot, tftrans)), vtemp_old);
      verticesLine[pickVTLine[i]] = vec2(vtemp_new[0], vtemp_new[1]);
      updateLineBuffers(pickVTLine[i], vec2(vtemp_new[0], vtemp_new[1]), []);
    }
    for (var i = 0; i < pickVTTriangle.length; i++) {
      var vtemp_old = vec4(VTTriangleSaved[i]);
      var vtemp_new = multMV(mult(tftransRV, mult(tfrot, tftrans)), vtemp_old);
      verticesTriangle[pickVTTriangle[i]] = vec2(vtemp_new[0], vtemp_new[1]);
      updateTriangleBuffers(pickVTTriangle[i], vec2(vtemp_new[0], vtemp_new[1]), [], 0, []);
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

    for (var i = 0; i < pickVTLine.length; i++) {
      var vtemp_old = vec4(VTLineSaved[i]); // update on the original vertices
      var vtemp_new = multMV(mult(tftransRV, mult(tfscale, tftrans)), vtemp_old);
      verticesLine[pickVTLine[i]] = vec2(vtemp_new[0], vtemp_new[1]);
      updateLineBuffers(pickVTLine[i], vec2(vtemp_new[0], vtemp_new[1]), []);
    }
    for (var i = 0; i < pickVTTriangle.length; i++) {
      var vtemp_old = vec4(VTTriangleSaved[i]);
      var vtemp_new = multMV(mult(tftransRV, mult(tfscale, tftrans)), vtemp_old);
      verticesTriangle[pickVTTriangle[i]] = vec2(vtemp_new[0], vtemp_new[1]);
      updateTriangleBuffers(pickVTTriangle[i], vec2(vtemp_new[0], vtemp_new[1]), [], 0, []);
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
  verticesLine = [];
  vertexColorsLine = [];
  verticesTriangle = [];
  vertexColorsTriangle = [];
  indicesTriangle = [];
  vBufferLine.numItems = 0;
  vBufferTriangle.numItems = 0; // number of points
  indexBufferTriangle.numItems = 0;
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
