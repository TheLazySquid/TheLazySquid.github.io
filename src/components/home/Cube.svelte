<script lang="ts">
    import { T, useTask } from '@threlte/core'
    import { HTML } from '@threlte/extras';
    import { shuffleArray } from '../../util/rng'
    import { Vector3 } from 'three';
    import type { ComponentType } from 'svelte';
    import { cubeSides, switchTo } from '../../lib/stores';
    import { cubes } from './cubes';

    export let sides: ComponentType[];
    let sidesLeft: ComponentType[] = [];

    interface SideInfo {
        position: Vector3;
        rotation: [number, number, number];
        visible: boolean;
        component: ComponentType | null;
        offset: number;
    }

    const getSideComponent = () => {
        if (sidesLeft.length === 0) {
            sidesLeft = shuffleArray([...sides]);
        }
        return sidesLeft.shift()!;
    }

    let sideInfo: SideInfo[] = [
        {position: new Vector3(0, 0, 1), rotation: [0, 0, 0], visible: true, component: null, offset: 0},
        {position: new Vector3(0, 0, -1), rotation: [0, Math.PI, 0], visible: true, component: null, offset: 0},
        {position: new Vector3(0, 1, 0), rotation: [-Math.PI / 2, 0, 0], visible: true, component: null, offset: 0},
        {position: new Vector3(0, -1, 0), rotation: [Math.PI / 2, 0, 0], visible: true, component: null, offset: 0},
        {position: new Vector3(1, 0, 0), rotation: [0, Math.PI / 2, 0], visible: true, component: null, offset: 0},
        {position: new Vector3(-1, 0, 0), rotation: [0, -Math.PI / 2, 0], visible: true, component: null, offset: 0}
    ]

    let canvas = document.querySelector("canvas")!;

    const setSides = (sides: ComponentType[]) => {
        sidesLeft = shuffleArray([...sides]);
        for(let info of sideInfo) {
            info.component = getSideComponent();
            info.offset = 0;
        }
        sideInfo = [...sideInfo];
    }

    $: setSides(sides);

    let sideOpacity = 1;
    let timeSinceOrbit = 0;

    switchTo.subscribe((val) => {
        sideOpacity = 1;
        timeSinceOrbit = 0;

        if(val) {
            setTimeout(() => {
                cubeSides.set(cubes[val]);
            }, 1500)
        }
    })

    useTask((delta) => {
        if(!$switchTo) return;
        timeSinceOrbit += delta;

        // 0-1500ms fade out, 1500-3000ms fade in
        if(timeSinceOrbit < 1.5) {
            sideOpacity = 1 - timeSinceOrbit / 1.5;
        } else if(timeSinceOrbit < 3) {
            sideOpacity = (timeSinceOrbit - 1.5) / 1.5;
        } else {
            sideOpacity = 1;
        }
    })
</script>

<T.DirectionalLight position={[ 12, 12, 12]} intensity={3} />
<T.DirectionalLight position={[ -12, -12, -12]} intensity={2.3} />

<T.Mesh>
    <T.BoxGeometry args={[20, 20, 20]} />
    <T.MeshStandardMaterial color="#282828" />
</T.Mesh>

{#each sideInfo as info}
    <HTML transform occlude
        position={info.position.clone().multiplyScalar(10 + Math.max(0, info.offset) + 0.0001).toArray()}
        rotation={info.rotation}
            on:visibilitychange={(e) => {
                if(e) {
                    // pick a new component that is not already visible
                    let visibleSides = sideInfo.filter(s => s.visible);
                    
                    let newComponent = getSideComponent();
                    if(visibleSides.length < sides.length) {
                        // just pick a random one
                        while (visibleSides.some(s => s.component === newComponent)) {
                            newComponent = getSideComponent();
                        }
                    }
    
                    info.offset = 0;
                    info.component = newComponent;
                }
    
                info.visible = e
            }}
    >
        <div class="overflow-y-auto sideRoot"
        on:pointercancel={e => canvas.dispatchEvent(new PointerEvent('pointercancel', e))}
        on:pointerdown={e => canvas.dispatchEvent(new PointerEvent('pointerdown', e))}
        class:hidden={!info.visible}
        style="width: 780px; height: 780px; opacity: {sideOpacity};">
            {#if info.component}
                <svelte:component this={info.component} on:offsetChange={(e) => {
                    info.offset = e.detail;
                }} />
            {/if}
        </div>
    </HTML>
{/each}

<style>
    .sideRoot:has(.noMax) {
        width: 5000px !important;
        height: 5000px !important;
    }
</style>