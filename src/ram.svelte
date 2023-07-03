<script>
    import BaseSelect from "./base_select.svelte";
    import Value from "./value.svelte";
    import format_num from "./lib/number.js";

    let base = 10;
    export let size = 16;
    export let ram = [];
    export let highlighted = null;
    export let sp = size - 1;
    export let pc = 0;
    export let clock = 0;
    let ram_display = [];
    if (ram.length == 0) {
        for (let i = 0; i < size; i++) {
            ram.push(0);
        }
    }
    function on_base() {
        for (let i in ram) {
            ram_display[i] = format_num(
                ram[i].toString(base).toUpperCase(),
                16,
                base
            );
        }
    }
    $: ramIsChange(ram);
    $: ramDIsChange(ram_display);
    function ramIsChange(newRam) {
        let idx = 0;
        for (let v of newRam) {
            ram_display[idx] = format_num(
                v.toString(base).toUpperCase(),
                16,
                base
            );
            idx++;
        }
    }
    function ramDIsChange(newRam) {
        let idx = 0;
        for (let v of newRam) {
            if (base == 16) {
                ram[idx] = Number("0x" + v.replace(/ /g, ""));
            } else if (base == 10) {
                ram[idx] = Number(v.replace(/ /g, ""));
            } else if (base == 2) {
                ram[idx] = Number("0b" + v.replace(/ /g, ""));
            } else {
                console.error("base not 10 2 or 16");
            }
            idx++;
        }
    }
    on_base();
</script>

<div id="wrapper">
    <BaseSelect bind:base on:base={on_base} />
    {#each ram_display as el, i}
        {#if sp == i}
            <div
                class="el"
                id="sp"
                on:click={() => {
                    highlighted = i;
                }}
            >
                <div class="idx">
                    {format_num(i.toString(base).toUpperCase(), 4, base)}
                </div>
                <Value bind:value={el} />
            </div>
        {:else if pc == i}
            <div
                class="el"
                id="high"
                on:click={() => {
                    highlighted = i;
                }}
            >
                <div class="idx">
                    {format_num(i.toString(base).toUpperCase(), 4, base)}
                </div>
                <Value bind:value={el} />
            </div>
        {:else}
            <div
                class="el"
                on:click={() => {
                    highlighted = i;
                }}
            >
                <div class="idx">
                    {format_num(i.toString(base).toUpperCase(), 4, base)}
                </div>
                <Value bind:value={el} />
            </div>
        {/if}
    {/each}
</div>

<style>
    #wrapper {
        margin: 10px;
        padding: 10px;
        display: flex;
        flex-direction: column;
        width: 248px;
        background-color: #353837;
        border-radius: 5px;
    }
    #name {
        margin: 0px;
        padding: 5px;
        color: white;
    }
    #high {
        padding-top: 0px;
        padding-bottom: 0px;
        margin-right: 0px;
        margin-left: 0px;
        border: 5px solid #fceb05;
    }
    #sp {
        padding-top: 0px;
        padding-bottom: 0px;
        margin-right: 0px;
        margin-left: 0px;
        border: 5px solid #0505fc;
    }
    .value {
        width: 180px;
    }
    .idx {
        width: 30px;
        margin: 5px;
        padding: 5px;
        text-align: right;
        background-color: #606060;
        border-radius: 5px;
    }
    .el {
        display: flex;
        margin-left: 5px;
        margin-right: 5px;
    }
</style>
