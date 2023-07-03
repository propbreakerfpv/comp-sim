<script>
    import Value from "./value.svelte";
    import BaseSelect from "./base_select.svelte";
    import format_num from "./lib/number.js";

    let base = 10;
    export let ra = 0;
    export let rb = 0;
    export let rc = 0;
    export let rd = 0;
    export let pc = 0;
    export let sp = 0;
    export let ir = 0;
    export let fr = 0;

    let registers = [];

    function get_opcode() {
        let opcode = (ir & 0b1111_0000_0000_0000) >> 12;
        let arg1 = ((ir & 3840) >> 8) & 0b0111;
        let arg2 = ir & 255 & 0b0111_1111;
        switch (opcode) {
            case 0:
                return `nop`;
            case 1:
                return `hlt`;
            case 2:
                return `add ${arg1} ${arg2}`;
            case 3:
                return `sub ${arg1} ${arg2}`;
            case 4:
                return `wrt ${arg2}`;
            case 5:
                return `mvm ${arg1} ${arg2}`;
            case 6:
                return `mvr ${arg1} ${arg2}`;
            case 7:
                return `push ${arg2}`;
            case 8:
                return `pop  ${arg2}`;
            case 9:
                return `jmp ${arg2}`;
            case 10:
                return `jnz ${arg2}`;
            case 11:
                return `jz ${arg2}`;
            case 12:
        }
    }
    function get_reg(reg) {
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
                return ir;
            case 7:
                return fr;
        }
    }
    function on_base() {
        console.log("base change to", base);
        for (let i in registers) {
            registers[i] = format_num(
                get_reg(Number(i)).toString(base).toUpperCase(),
                16,
                base
            );
            console.log("reg", i, registers[i]);
        }
    }
    function set_reg(reg, val) {
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
                ir = val;
                break;
            case 7:
                fr = val;
                break;
        }
    }
    $: registersIsChange(registers);
    $: regIsChange(ra, 0);
    $: regIsChange(rb, 1);
    $: regIsChange(rc, 2);
    $: regIsChange(rd, 3);
    $: regIsChange(pc, 4);
    $: regIsChange(sp, 5);
    $: regIsChange(ir, 6);
    $: regIsChange(fr, 7);
    function regIsChange(reg, idx) {
        registers[idx] = format_num(reg.toString(base).toUpperCase(), 16, base);
    }
    function registersIsChange(newReg) {
        let idx = 0;
        for (let v of newReg) {
            if (base == 16) {
                set_reg(idx, Number("0x" + v.toString().replace(/ /g, "")));
            } else if (base == 10) {
                set_reg(idx, Number(v.toString().replace(/ /g, "")));
            } else if (base == 2) {
                set_reg(idx, Number("0b" + v.toString().replace(/ /g, "")));
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
    <h3 class="name">RA</h3>
    <Value bind:value={registers[0]} />
    <h3 class="name">RB</h3>
    <Value bind:value={registers[1]} />
    <h3 class="name">RC</h3>
    <Value bind:value={registers[2]} />
    <h3 class="name">RD</h3>
    <Value bind:value={registers[3]} />
    <h3 class="name">Program Counter</h3>
    <Value bind:value={registers[4]} />
    <h3 class="name">Stack Pointer</h3>
    <Value bind:value={registers[5]} />
    <h3 class="name">Instruction Register</h3>
    <Value bind:value={registers[6]} />
    <div class="reg">{get_opcode(ir)}</div>
    <h3 class="name">Flags Register</h3>
    <Value bind:value={registers[7]} />
</div>

<style>
    #wrapper {
        margin: 10px;
        padding: 10px;
        display: flex;
        flex-direction: column;
        width: 200px;
        background-color: #353837;
        border-radius: 5px;
    }
    .name {
        margin: 0px;
        padding: 5px;
        color: white;
    }
    .reg {
        /* display: inline; */
        margin: 5px;
        padding: 5px;
        background-color: #606060;
        border-radius: 5px;
    }
</style>
