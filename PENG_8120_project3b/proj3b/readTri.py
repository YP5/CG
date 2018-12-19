# -*- coding: utf-8 -*-
"""
Created on Tue Dec 18 23:22:43 2018

@author: YP
"""


player = {}
f = open("teapots.tri")
data = f.readlines()
f.close()

f = open("teapotTriVert.js","w") 
f.write("var TeapotVerts = [\n" )

i = 0


for string in data:
    linefix = [];
    
    line = string.split(' ')
    
    for word in line:
      if word == '':
          pass
      else:
          linefix.append(word)
    
    if linefix[0] == "Triangle\n":  # write vertices
       pass
    elif linefix[0] == "255":
        pass
    
    else: 
        linefix[5] = linefix[5].replace('\n','')
        f.write( 'vec4('+linefix[0] + "," + linefix[1] + ","+linefix[2] + ',1.0'+"),\n")
    
f.write("];\n") 
 
f.close()


i = 0

f = open("teapotTriNorm.js","w") 
f.write("var TeapotNorms = [\n" )

for string in data:
    linefix = [];
    
    line = string.split(' ')
    
    for word in line:
      if word == '':
          pass
      else:
          linefix.append(word)
    
    if linefix[0] == "Triangle\n":  # write vertices
       pass
    elif linefix[0] == "255":
        pass
    
    else: 
        linefix[5] = linefix[5].replace('\n','')
        f.write('vec3('+ linefix[3] + "," + linefix[4] + ","+linefix[5] +"),\n")
    
f.write("];\n") 
 
f.close()