
This application performs the following functions:

1. Adjust the eye, at, and up position with sliders.
2. Adjust the near, far plane, and fov position with sliders. 
3. UP vector cannot be in the same direction as eye to at. All vectors cannot be length zero. These conditions are set in the checkCam() function. 
4. The perspective() function in MV.js is modified. Item [2][2] and [2][3] sign is changed.
