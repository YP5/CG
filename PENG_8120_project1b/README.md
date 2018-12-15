****
How to run:
Since local images are used for the graphical interface icons, please allow the browser to use local files to enable that function.

For chrome, this could be done by start chrome in command lines:

1. cmd
   start chrome --allow-file-access-from-files.
2. Then the html file could be run on the browser.



****
This application performs an interactive drawing canvas:

1. Query a world coordinate system and display coordinates in different CSY. 
   All vertices are maintained in world CSY.

2. draw line
3. draw triangle
4. choose vertex color
5. clear the drawing
5. fill the triangles 
(2-5 same as proj 1a)

6. pick primitive by clicking on vertex. 
   Translation is immediately available after picking

7. pick primitive by dragging a bounding box. 
   Translation is not immediately available since the dragging operation is reserved for bounding box. (Could add a bounding box buffer to display bounding box. Currently not displayed)

8. Translation
    Click and drag to translate. The last vertex selected will be following the mouse point. (could be modified that the center of bounding box will follow)

9. Rotate. 
   Click and drag left/right. The rotation will be around the last vertex selected.(could be modified to rotate about bounding box center)

10. Scale
   Click and drag to scale in either direction or both. Scale will be around the last vertex selected. (could be modified to scale about bounding box center)

11. All matrices are represented by 4X4 matrix (added z for later 3D tranformation usage, but z is constant, could remove z to become 3X3 matrices).

