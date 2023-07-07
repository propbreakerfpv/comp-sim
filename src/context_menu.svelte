<script>
    // import { tick } from "svelte";

    function clickOutside(node) {
        const handleClick = (event) => {
            if (
                node &&
                !node.contains(event.target) &&
                !event.defaultPrevented
            ) {
                node.dispatchEvent(new CustomEvent("clickOutside", node));
            }
        };

        document.addEventListener("click", handleClick, true);

        return {
            destroy() {
                document.removeEventListener("click", handleClick, true);
            },
        };
    }

    export let items = [];

    let open = false;
    let top = 0,
        left = 0;

    export function show(event) {
        event.preventDefault();
        open = true;
        top = event.pageY;
        left = event.pageX;
    }
    export function hide() {
        open = false;
    }
</script>

<svelte:options accessors />
<nav
    class="contextmenu"
    style="display: {open ? 'flex' : 'none'}; top: {top}px; left: {left}px"
    on:click={hide}
    use:clickOutside
    on:clickOutside={hide}
>
    {#each items as item}
        {#if item == "---"}
            <hr />
        {:else}
            <button on:click={item.handler}>
                {item.label}
                {#if item.shortcut}
                    <span class="shortcut">{item.shortcut}</span>
                {/if}
            </button>
        {/if}
    {/each}
</nav>

<style>
    .contextmenu {
        display: none;
        flex-direction: column;
        gap: 5px;
        position: absolute;
        background: #415266;
        min-width: 120px;
    }
    button {
        background: none;
        border: none;
        border-radius: 2px;
        padding: 4px;
        margin: 3px;
        cursor: pointer;
        text-align: left;
        display: flex;
        justify-content: space-between;
        gap: 5px;
        place-items: center;
    }
    button:hover {
        background: #4f647c;
    }
    .shortcut {
        color: #666;
        font-size: 0.7em;
    }
</style>
