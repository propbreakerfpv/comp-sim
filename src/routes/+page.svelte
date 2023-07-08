<script>
    import Ram from "../ram.svelte";
    import Registers from "../registers.svelte";
    import Legend from "../legend.svelte";
    import Display from "../display.svelte";
    import write from "../lib/display.js";
    import Editor from "../editor.svelte";
    import sleep from "../lib/helpers.js"

    let cursor = 0;
    let display = new Array(32).fill(" ");
    let config = 0;
    let ram_size = 16;
    let legend = false;
    let running = false;
    let play_pause = "PLAY";
    let editing = true;
    let clock = 0;
    let fdx_step = 1;
    let ir = 0;
    let pc = 0;
    let alu_sum = 0;
    let ra = 0;
    let rb = 0;
    let rc = 0;
    let rd = 0;
    let fr = 0;
    let sp = 15;
    let ram = new Array(16).fill(0);
    function get_reg(reg) {
        reg = reg & 0b111;
        switch (reg) {
            case 0:
                return ra;
            case 1:
                return rb;
            case 2:
                return rc;
            case 3:
                return rd;
            case 4:
                return pc;
            case 5:
                return sp;
            case 6:
                return config;
        }
    }
    function set_reg(reg, val) {
        console.log(reg);
        reg = reg & 0b111;
        val = val & 0b111_1111;
        console.log("set reg", reg, val);
        switch (reg) {
            case 0:
                ra = val;
                break;
            case 1:
                rb = val;
                break;
            case 2:
                rc = val;
                break;
            case 3:
                rd = val;
                break;
            case 4:
                pc = val;
                break;
            case 5:
                sp = val;
                break;
            case 6:
                config = val;
                break;
        }
    }
    function editor() {
        if (editing) {
            editing = false;
        } else {
            editing = true;
        }
    }
    function play() {
        if (play_pause == "PLAY") {
            play_pause = "PAUSE";
            running = true;
            loop2();
        } else {
            running = false;
            play_pause = "PLAY";
        }
    }
    function step() {
        running = true;
        loop2();
        sleep(20);
        running = false;
    }
    function reset() {
        running = false;
        play_pause = "PLAY";
        ra = 0;
        rb = 0;
        rc = 0;
        rd = 0;
        pc = 0;
        sp = ram_size - 1;
        ir = 0;
        fr = 0;
        cursor = 0;
        config = 0;
        clock = 0;
        display = new Array(32).fill(" ");
    }
    function get_arg_value(arg1, arg2) {
        let memadr = (arg1 & 8) >> 3;
        let literal = (arg1 & 0b0100) >> 2;
        let key = Number("0b" + memadr.toString(2) + "0");
        key = Number("0b" + memadr.toString(2) + "0") | literal;
        switch (key) {
            case 0:
                return get_reg(arg2);
            case 1:
                return arg2 & 0b0111_1111;
            case 2:
                return ram[get_reg(arg2)];
            case 3:
                return ram[arg2];
        }
    }
    function get_arg_values(arg1, arg2) {
        let memadr = (arg1 & 8) >> 3;
        let literal = (arg2 & 128) >> 7;
        let key = Number("0b" + memadr.toString(2) + "0");
        key = Number("0b" + memadr.toString(2) + "0") | literal;
        console.log(key, arg2.toString(2));
        arg2 = arg2 & 0b0111_1111;
        switch (key) {
            case 0:
                return get_reg(arg2);
            case 1:
                return arg2 & 0b0111_1111;
            case 2:
                return ram[get_reg(arg2)];
            case 3:
                return ram[arg2];
        }
    }
    async function setup() {
        await sleep(1000);
        ir = ram[pc];
    }
    async function loop2() {
        while (running) {
            if (pc >= ram.length - 1) {
                break;
            }
            ir = ram[pc];
            pc += 1;

            let opcode = (ir & 61440) >> 12;
            let arg1 = (ir & 0b0000_1111_0000_0000) >> 8;
            console.log("arg1", arg1);
            let arg2 = ir & 255;
            switch (opcode) {
                case 0:
                    break;
                case 1:
                    running = false;
                    break;
                case 2:
                    alu_sum = get_reg(arg1) + get_arg_values(arg1, arg2);
                    console.log("alu sum", alu_sum, "arg1", arg1, "arg2", arg2);
                    set_reg(arg1, alu_sum);
                    if (alu_sum == 0) {
                        fr = 1;
                    } else {
                        fr = 0;
                    }
                    break;
                case 3:
                    alu_sum = get_reg(arg1) - get_arg_values(arg1, arg2);
                    console.log("alu sum after sub is", alu_sum);
                    console.log("alu sum", alu_sum, "arg1", arg1, "arg2", arg2);
                    set_reg(arg1, alu_sum);
                    if (alu_sum == 0) {
                        fr = 1;
                    } else {
                        fr = 0;
                    }
                    break;
                case 4:
                    // write
                    [display, cursor, config] = write(
                        display,
                        cursor,
                        config,
                        get_arg_value(arg1, arg2)
                    );
                    break;
                case 5:
                    let memadr = (arg1 & 8) >> 3 == 1;
                    let literal = (arg2 & 128) >> 7 == 1;
                    let memaddress;
                    if (literal) {
                        memaddress = arg2 & 0b111_1111;
                    } else {
                        memaddress = get_reg(arg2);
                    }
                    if (memadr) {
                        ram[memaddress] = arg1;
                    } else {
                        ram[memaddress] = get_reg(arg1);
                    }
                    break;
                case 6:
                    let arg_value = get_arg_values(arg1, arg2);
                    if (arg_value != null) {
                        set_reg(arg1, arg_value);
                    } else {
                        console.error("problem geting arg values");
                    }
                    break;
                case 7:
                    // push
                    ram[sp] = get_arg_value(arg1, arg2);
                    sp --;
                    break;
                case 8:
                    // pop
                    if (sp < ram_size - 1) {
                        sp ++;
                    }
                    set_reg(arg2, ram[sp]);
                    break;
                case 9:
                    pc = get_arg_value(arg1, arg2);
                    break;
                case 10:
                    if (fr == 0) {
                        pc = get_arg_value(arg1, arg2);
                    }
                    break;
                case 11:
                    if (fr == 1) {
                        pc = get_arg_value(arg1, arg2);
                    }
                    break;
            }
            clock += 1;
            fdx_step = 1;
            await sleep(1000);
        }
        play_pause = "PLAY";
    }
    setup();
    loop2();
</script>

<div id="controls">
    <button on:click={play} id="play">{play_pause}</button>
    <button on:click={step} id="step">STEP</button>
    <button on:click={reset} id="reset">RESET</button>
    <p id="clock">{clock}</p>
    <button on:click={editor} id="editor">editor</button>
    <button on:click={() => (legend = !legend)} id="step">legend</button>
</div>
{#if legend}
    <Legend />
{:else if editing}
    <Editor bind:editing bind:ram />
{:else}
    <div class="wrapper">
        <Ram bind:ram highlighted="3" size={ram_size} bind:pc bind:sp/>
        <Registers
            bind:ra
            bind:rb
            bind:rc
            bind:rd
            bind:pc
            bind:ir
            bind:sp
            bind:fr
        />
        <Display bind:display bind:config bind:cursor />
    </div>
{/if}

<style>
    #controls {
        display: inline;
    }
    #clock {
        display: inline;
    }
    .wrapper {
        display: flex;
    }
</style>
