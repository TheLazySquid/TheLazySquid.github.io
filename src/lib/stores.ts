import type { ComponentType } from "svelte";
import { writable } from "svelte/store";
import Logo from "../components/home/cubes/main/Logo.svelte";
import Links from "../components/home/cubes/main/Links.svelte";
import AboutMe from "../components/home/cubes/main/AboutMe.svelte";
import Projects from "$lib/components/home/cubes/main/Projects.svelte";

export let switchTo = writable<string | null>(null);
// I would love to import cubes and use cubes.main but that breaks HMR
export let cubeSides = writable<ComponentType[]>([ Logo, Links, AboutMe, Projects ])
export let linkingTo = writable<string | null>(null);