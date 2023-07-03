<script>
    import Value from "./value.svelte";
    import BaseSelect from "./base_select.svelte";
    import format_num from "./lib/number.js"

    export let config = 0;
    export let cursor = 31;
    export let display = [];
    let registers = [];
    let base = 10;
    const size = 32;
    if (display.length == 0) {
        for (let i = 0; i < size; i++) {
            display.push(" ");
        }
    }

    function get_config(c) {
        switch (c) {
            case 0:
                return "Number";
            case 1:
                return "ASCII";
            default:
                return "Unknown";
        }
    }
    function on_base() {
        // console.log("base change to", base);
        for (let i in registers) {
            registers[i] = format_num(get_reg(Number(i)).toString(base).toUpperCase(), 16, base)
            // console.log("reg", i, registers[i]);
        }
    }
    $: registersIsChange(registers)
    $: regIsChange(cursor, 0);
    $: regIsChange(config, 1);
    function regIsChange(reg, idx) {
        registers[idx] = format_num(reg.toString(base).toUpperCase(), 16, base);
    }
    function set_reg(reg, val) {
        switch (reg) {
            case 0:
                cursor = val;
                break;
            case 1:
                config = val;
                break;
        }
    }
    function get_reg(reg) {
        switch (reg) {
            case 0:
                return cursor;
            case 1:
                return config;
        }
    }
    function registersIsChange(newReg) {
        let idx = 0;
        for (let v of newReg) {
            if (base == 16) {
                set_reg(idx, Number("0x" + v.toString().replace(/ /g,'')))
            }else if (base == 10) {
                set_reg(idx, Number(v.toString().replace(/ /g,'')))
            }else if (base == 2) {
                set_reg(idx, Number("0b" + v.toString().replace(/ /g,'')))
            }else {
                console.error("base not 10 2 or 16");
            }
            idx ++;
        }
    }
    on_base();
</script>

<div id="wrapper">
    <BaseSelect bind:base on:base={on_base} />
    <h2 class="name">Display</h2>
    <div id="display">
        <div>
            {#each display.slice(0, 16) as i, idx}
                {#if idx == cursor}
                    <div class="char" id="cursor">{i}</div>
                {:else}
                    <div class="char">{i}</div>
                {/if}
            {/each}
        </div>
        <div>
            {#each display.slice(16, 32) as i, idx}
                {#if idx + 16 == cursor}
                    <div class="char" id="cursor">{i}</div>
                {:else}
                    <div class="char">{i}</div>
                {/if}
            {/each}
        </div>
    </div>
    <h3 class="name">Cursor</h3>
    <Value bind:value={registers[0]} />
    <h3 class="name">Config</h3>
    <Value bind:value={registers[1]} />
    <div class="config">{get_config(config)}</div>
</div>

<style>
    #cursor {
        background-color: #294f42;
    }
    @import url("https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap");
    .char {
        font-family: "Press Start 2P", cursive;
        display: inline-block;
        margin: 2px;
        padding: 2px;
        background-color: #4e4f4e;
        white-space: pre;
        width: 12px;
        text-align: center;
    }
    #display {
        margin: 5px;
        padding: 5px;
        background-color: #606060;
        border-radius: 5px;
    }
    #wrapper {
        margin: 10px;
        padding: 10px;
        display: flex;
        flex-direction: column;
        width: 340px;
        background-color: #353837;
        border-radius: 5px;
    }
    .name {
        margin: 0px;
        padding: 5px;
        color: white;
    }
    .reg {
        margin: 5px;
        padding: 5px;
        background-color: #606060;
        border-radius: 5px;
    }
</style>
