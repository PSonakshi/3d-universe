import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.152.0/build/three.module.js';

export class OrbitControls {
  constructor(camera, domElement) {
    this.camera = camera;
    this.domElement = domElement;

    this.enabled = true;
    this.dampingFactor = 0.25;
    this.screenSpacePanning = false;

    this._zoomSpeed = 1.0; // Set zoom speed
    this._panSpeed = 1.0;
    this._keyPanSpeed = 7.0;

    this._target = new THREE.Vector3(0, 0, 0); // Center point (target)
    this._distance = 30;  // Initial distance for zoom (closer)
    this._minDistance = 10;  // Minimum zoom distance
    this._maxDistance = 100; // Maximum zoom distance

    this._pointer = { x: 0, y: 0 };

    this._start = { x: 0, y: 0 };
    this._end = { x: 0, y: 0 };

    // Event listeners for mouse and touch
    this.domElement.addEventListener('wheel', this._onMouseWheel.bind(this), false);
    this.domElement.addEventListener('touchstart', this._onTouchStart.bind(this), false);
    this.domElement.addEventListener('touchmove', this._onTouchMove.bind(this), false);
    this.domElement.addEventListener('touchend', this._onTouchEnd.bind(this), false);

    // Set initial camera position at a 45-degree angle from the origin
    this.camera.position.set(30, 30, 30); // Camera positioned closer to the system
    this.camera.lookAt(this._target); // Make sure camera looks at the center point
  }

  // Mouse wheel handler for zoom
  _onMouseWheel(event) {
    if (this.enabled) {
      // Adjust the zoom level based on the wheel delta (event.deltaY)
      this._distance -= event.deltaY * 0.05;  // Zoom speed factor (adjusted for closer zoom)
      this._distance = Math.max(this._minDistance, Math.min(this._distance, this._maxDistance));  // Clamp the zoom distance

      // Update the camera's position (along y axis) based on the zoom distance
      this.camera.position.y = this._target.y + Math.sin(Math.PI / 4) * this._distance; // Keep vertical movement smooth
      this.camera.position.x = Math.cos(Math.PI / 4) * this._distance; // Maintain horizontal angle
      this.camera.position.z = Math.sin(Math.PI / 4) * this._distance; // Maintain horizontal angle

      // Ensure the camera always looks at the target point (center of the solar system)
      this.camera.lookAt(this._target);
    }
  }

  // Touch start handler for touch events
  _onTouchStart(event) {
    if (this.enabled) {
      this._start.x = event.touches[0].clientX;
      this._start.y = event.touches[0].clientY;
    }
  }

  // Touch move handler for touch events
  _onTouchMove(event) {
    if (this.enabled) {
      this._pointer.x = (event.touches[0].clientX / window.innerWidth) * 2 - 1;
      this._pointer.y = -(event.touches[0].clientY / window.innerHeight) * 2 + 1;
    }
  }

  // Touch end handler for touch events
  _onTouchEnd() {
    if (this.enabled) {
      this._end.x = this._pointer.x;
      this._end.y = this._pointer.y;
    }
  }

  // Update the camera position and apply rotation
  update() {
    if (this.enabled) {
      // Ensure that camera is always pointed towards the target
      this.camera.lookAt(this._target);
    }
  }
}
