# -*- coding: utf-8 -*-
"""
Lst modified on Wed Nov 8 13:30:34 2018

@author: YP
"""

player = {}
f = open("dolphins.tmp")
data = f.readlines()
f.close()

f = open("dophins.js","w") 
f.write("var vertices = [\n" )


for string in data:
    
    line = string.split(' ')
    
    if line[0] == "v":  # write vertices
        line[3] = line[3].replace('\n','')
        f.write("vec4(" + line[1] + "," + line[2] + ","+ line[3] +  "),\n")
        
    elif line[0] == "dolph01\n":
        f.write("];\n")  # end vertices writing
        f.write("var indices_d1 = [\n" )  # dolph1 indices writing
        
    elif line[0] == "f": 
        line[3] = line[3].replace('\n','')
        f.write( str(int(line[1])-1) + "," + str(int(line[2])-1) + ","+ str(int(line[3])-1) +  ",\n")
    
    elif line[0] == "dolph02\n":
        f.write("];\n")  # end vertices writing
        f.write("var indices_d2 = [\n" )  # dolph1 indices writing
        
    elif line[0] == "dolph03\n":
        f.write("];\n")  # end vertices writing
        f.write("var indices_d3 = [\n" )  # dolph1 indices writing
        
f.write("];\n") 
 
f.close()