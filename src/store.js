import { browser } from "$app/env"
import { writable } from "svelte/store"

export const files = writable([]);

files.subscribe((val) => browser && sessionStorage.setItem("files", val))
