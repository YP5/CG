This application performs the following functions:

1. Transform the object data file into javescript arrays. 
   Read the vertices in to a vertex array, and read the face indices into three index arrays. 
   This is done with read.py (python)
   The indices start with 1 not 0 so that the maximum is larger than number of vertices. Adjust that by subtracting 1 from all indices. This is also done in read.py.

2. colors are randomly assigned for each vertex.

3. Two objects are available for viewing, could be changed by changing the selection in the dropdown list. The slider ranges will be updated accordingly.

4. Use sliders to adjust the parameter for viewing. 