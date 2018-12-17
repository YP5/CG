This application performs the following functions:

1. The camera view and projection matrices are generated in mProjection().
   Resulting matrices are displayed in tables on the interface. 

2. Use sliders to change all viewing parameters. Field of view could be used to change the width and height of the projection window. 

3. Two views are displayed, one in the screen space, one shows the viewing volume. 

4. While drawing the view volume, two methods are available: 
   a. specify everything in camera CSY (boundaries will be near, far, left, right, top, bottom)
   b. specify everything in projected CSY (boundaries will be -1s and 1s)

5. The corners of the view volume after projection are displayed, in camera CSY. 



-- to update:
1. enable parameter change by defining left, right, top, and bottom, thus the center of the projection volume is not always on z axis. 