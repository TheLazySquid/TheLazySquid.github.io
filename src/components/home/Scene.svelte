<script lang="ts">
  import { T, useTask } from '@threlte/core'
  import { OrbitControls } from '@threlte/extras';
  import Cube from './Cube.svelte';
  import { cubeSides, switchTo, linkingTo } from '../../lib/stores';
  import { Vector3, type PerspectiveCamera } from 'three';
  import { tick } from 'svelte';
  
  let camera: PerspectiveCamera;
  let moveSpeed = 0.01;
  let msElapsed = 0;

  function updateCameraDistance() {
    let smallerDimension = Math.min(window.innerWidth, window.innerHeight);
    let dist = 1080*32/smallerDimension;

    camera.position.normalize().multiplyScalar(dist);
  }

  let controlsOn = true;
  switchTo.subscribe(async (val) => {
    let position = camera?.position?.clone();

    if(!val) {
      controlsOn = true;

      if(position) {
        await tick();
        camera.position.set(position.x, position.y, position.z);      
      }
      return;
    }

    setTimeout(() => switchTo.set(null), 3000);
    moveSpeed = 0.01;
    controlsOn = false;
    msElapsed = 0;

    await tick()
    camera.position.set(position.x, position.y, position.z);
  })

  linkingTo.subscribe(async (val) => {
    if(!val) return;

    let position = camera?.position?.clone();
    await tick();
    camera.position.set(position.x, position.y, position.z);

    setTimeout(() => {
      location.href = val;
    }, 1000)
  })

  useTask((delta) => {
    if($switchTo) {
      msElapsed += delta;
  
      if(msElapsed < 1.5) {
        moveSpeed += delta * 0.12;
      } else {
        moveSpeed -= delta * 0.12;
      }
      
      // rotate the camera a little horizontally around the origin
      camera.position.applyAxisAngle(new Vector3(0, 1, 0), moveSpeed);
    }

    if($linkingTo) {
      moveSpeed += delta * 0.1;

      // move the camera out and rotate it a little
      camera.position.applyAxisAngle(new Vector3(0, 1, 0), moveSpeed);
      camera.position.multiplyScalar(1.02);
    }
  })
</script>

<svelte:window on:resize={updateCameraDistance} />

<T.PerspectiveCamera
  makeDefault
  position={[37, 0, 0]}
  on:create={({ ref }) => {
    camera = ref
    updateCameraDistance();
  }}
>
  <OrbitControls enabled={controlsOn && !$linkingTo} enableDamping
    enableZoom={false} enablePan={false} />
</T.PerspectiveCamera>

<Cube sides={$cubeSides} />