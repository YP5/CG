var canvas;
var gl;

var numVertices = 36;

var texSize = 64;

var program;

var pointsArray = [];
var colorsArray = [];
var texCoordsArray = [];



var texCoord = [
  vec2(0, 0),
  vec2(0, 1),
  vec2(1, 1),
  vec2(1, 0)
];

var vertices = [
  vec4(-0.5, -0.5, 0.5, 1.0),
  vec4(-0.5, 0.5, 0.5, 1.0),
  vec4(0.5, 0.5, 0.5, 1.0),
  vec4(0.5, -0.5, 0.5, 1.0),
  vec4(-0.5, -0.5, -0.5, 1.0),
  vec4(-0.5, 0.5, -0.5, 1.0),
  vec4(0.5, 0.5, -0.5, 1.0),
  vec4(0.5, -0.5, -0.5, 1.0)
];

var vertexColors = [
  vec4(0.0, 0.0, 0.0, 1.0), // black
  vec4(1.0, 0.0, 0.0, 1.0), // red
  vec4(1.0, 1.0, 0.0, 1.0), // yellow
  vec4(0.0, 1.0, 0.0, 1.0), // green
  vec4(0.0, 0.0, 1.0, 1.0), // blue
  vec4(1.0, 0.0, 1.0, 1.0), // magenta
  vec4(0.0, 1.0, 1.0, 1.0), // white
  vec4(0.0, 1.0, 1.0, 1.0) // cyan
];

var xAxis = 0;
var yAxis = 1;
var zAxis = 2;
var axis = xAxis;
var theta = [45.0, 45.0, 45.0];

var thetaLoc;

function configureTexture(image) {
  // create a GL texture object
  var texture = gl.createTexture();
  // bind it
  gl.bindTexture(gl.TEXTURE_2D, texture);
  // image operations - flip y
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
  // specify a 2D image texture, pass the image to it
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
  // generate a mip map
  gl.generateMipmap(gl.TEXTURE_2D);
  // texture parameters for mip maps
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER,
    gl.NEAREST_MIPMAP_LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);


  return texture;
}


function quad(a, b, c, d) {
  // specify vertices, vertex colors, and texture coords
  // for quad
  pointsArray.push(vertices[a]);
  colorsArray.push(vertexColors[a]);
  texCoordsArray.push(texCoord[0]);

  pointsArray.push(vertices[b]);
  colorsArray.push(vertexColors[a]);
  texCoordsArray.push(texCoord[1]);

  pointsArray.push(vertices[c]);
  colorsArray.push(vertexColors[a]);
  texCoordsArray.push(texCoord[2]);

  pointsArray.push(vertices[a]);
  colorsArray.push(vertexColors[a]);
  texCoordsArray.push(texCoord[0]);

  pointsArray.push(vertices[c]);
  colorsArray.push(vertexColors[a]);
  texCoordsArray.push(texCoord[2]);

  pointsArray.push(vertices[d]);
  colorsArray.push(vertexColors[a]);
  texCoordsArray.push(texCoord[3]);
}


function colorCube() {
  // 6 quads of the cube
  quad(1, 0, 3, 2);
  quad(2, 3, 7, 6);
  quad(3, 0, 4, 7);
  quad(6, 5, 1, 2);
  quad(4, 5, 6, 7);
  quad(5, 4, 0, 1);
}


window.onload = function init() {

  canvas = document.getElementById("gl-canvas");

  gl = WebGLUtils.setupWebGL(canvas);
  if (!gl) {
    alert("WebGL isn't available");
  }

  gl.viewport(0, 0, canvas.width, canvas.height);
  gl.clearColor(1.0, 1.0, 1.0, 1.0);

  gl.enable(gl.DEPTH_TEST);

  //
  //  Load shaders and initialize attribute buffers
  //
  program = initShaders(gl, "vertex-shader", "fragment-shader");
  gl.useProgram(program);

  colorCube();

  // color buffer
  var cBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, flatten(colorsArray), gl.STATIC_DRAW);

  var vColor = gl.getAttribLocation(program, "vColor");
  gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(vColor);

  // vertex buffer
  var vBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, flatten(pointsArray), gl.STATIC_DRAW);

  var vPosition = gl.getAttribLocation(program, "vPosition");
  gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(vPosition);

  // texture coordinate buffer
  var tBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, tBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, flatten(texCoordsArray), gl.STATIC_DRAW);

  // texture coordinate variables shared with  shader
  var vTexCoord = gl.getAttribLocation(program, "vTexCoord");
  gl.vertexAttribPointer(vTexCoord, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(vTexCoord);

  //
  // Initialize a texture
  //

  // specify the texture image (can be jpg, tiff, gif) or
  // can specify your own image array
  /*
  var image = new Image();
  image.src = "krs3d.jpg"
  //	image.src = "SA2011_black.jpg"
  image.onload = function() {
    configureTexture(image);
  }
*/


  image1 = new Image();
  image1.src = "uncclogo.jpg"
  //	image.src = "SA2011_black.jpg"
  image1.onload = function() {
    texture1 = configureTexture(image1);
    gl.uniform1i(gl.getUniformLocation(program, "texture1"), 0)


  }

  image2 = new Image();
  image2.src = "uncc2.jpg"
  //	image.src = "SA2011_black.jpg"
  image2.onload = function() {
    texture2 = configureTexture(image2);
    gl.uniform1i(gl.getUniformLocation(program, "texture2"), 1);
  }


  // can also get this from the UI
  //  var image = document.getElementById("texImage");
  //  configureTexture( image );

  thetaLoc = gl.getUniformLocation(program, "theta");
  uopacity = gl.getUniformLocation(program, "opacity");

  document.getElementById("ButtonX").onclick = function() {
    axis = xAxis;
  };
  document.getElementById("ButtonY").onclick = function() {
    axis = yAxis;
  };
  document.getElementById("ButtonZ").onclick = function() {
    axis = zAxis;
  };

  render();

}

var opacity = 0.5;
var texture1, texture2;
var uopacity;

var render = function() {
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  theta[axis] += 2.0;
  gl.uniform3fv(thetaLoc, flatten(theta));

  gl.uniform1f(uopacity, opacity);

  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture( gl.TEXTURE_2D, texture1 );
  gl.activeTexture(gl.TEXTURE1);
  gl.bindTexture( gl.TEXTURE_2D, texture2 );

  gl.drawArrays(gl.TRIANGLES, 0, numVertices);
  requestAnimFrame(render);
}
