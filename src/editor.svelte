<script>
    import compile from "./lib/asm";
    import format_num from "./lib/number";
    import { browser } from "$app/environment";
    import ContextMenu from "./context_menu.svelte";

    export let editing;
    export let ram;
    let files = [];
    let name = "unnamed";
    let hover = null;
    let show_opt = null;
    let errors = [];
    let value = "";
    let lines = 20;
    let context_menu = {};
    let selected_file = null;
    let renaming_file = null;
    let renaming_value = "";
    let context = { file_name: "unnamed" };
    let items = [
        { label: "rename", handler: rename_file },
        { label: "delete", handler: delete_file },
        { label: "new", handler: new_file },
    ];

    try {
        if (browser && localStorage) {
            files = JSON.parse(localStorage.getItem("files")).files;
            if (files == null) {
                localStorage.setItem("files", '{"files": []}');
                files = [];
            }
            context = JSON.parse(localStorage.getItem("__context__"));
            if (context == null) {
                localStorage.setItem("files", '{"file_name": "unnamed"}');
                context = { file_name: "unnamed" };
            }
            name = context.file_name;
            for (let i = 0; i < files.length; i++) {
                if (files[i].name == name) {
                    value = files[i].value;
                }
            }
        }
    } catch (e) {
        console.error("failed to read from localStorage", e);
    }

    function rename_file() {
        renaming_file = selected_file;
    }
    function rename_if_enter(event) {
        let old_name = files[renaming_file].name;
        if (event.key == "Enter") {
            for (let i = 0; i < files.length; i++) {
                if (files[i].name == old_name && i == renaming_file) {
                    files[i].name = renaming_value;
                }
            }
            save();
            renaming_file = null;
            if (name == old_name) {
                name = renaming_value;
            }
        }
    }
    function delete_file() {
        let selected_name = "";
        files.forEach((e, i) => {
            if (i == selected_file) {
                selected_name = e.name;
            }
        });
        files = files.filter((_, i) => i != selected_file);
        if (name == selected_name) {
            name = files[files.length - 1].name;
            value = files[files.length - 1].value;
        }
        save();
    }
    function new_file() {
        files.push({ name: "unnamed", value: "" });
        renaming_file = files.length - 1;
    }
    function create_line_numbers() {
        let out = [];
        for (let i = 0; i < lines; i++) {
            out.push(i.toString() + "       ");
        }
        return out.join("");
    }
    function load() {
        let { code, es } = compile(value);
        errors = es;
        for (let i = 0; i < ram.length; i++) {
            if (code[i] != null && code[i] != undefined) {
                ram[i] = Number("0b" + code[i]);
            } else {
                ram[i] = 0;
            }
        }
        editing = false;
    }
    function save() {
        if (browser && localStorage) {
            for (let i = 0; i < files.length; i++) {
                if (files[i].name == name && value != null) {
                    console.log("file", files[i]);
                    files[i].value = value;
                }
            }

            localStorage.setItem("files", JSON.stringify({ files: files }));
            context.file_name = name;
            localStorage.setItem("__context__", JSON.stringify(context));
        }
    }
    function select_file(file) {
        if (browser && localStorage) {
            if (value != null && value.length > 0) {
                save();
            }
            for (let e of files) {
                if (e.name == file) {
                    value = e.value;
                    name = e.name;
                    context.file_name = e.name;
                }
            }
            localStorage.setItem("__context__", JSON.stringify(context));
        }
    }
    function display_delete_btn(idx) {
        hover = idx;
    }
    function show_file_options(idx) {
        selected_file = idx;
        let e = new Event("ContextMenu");
        e.pageY = window.event.clientY;
        e.pageX = window.event.clientX;
        context_menu.show(e);
    }
    function auto_save(_) {
        save();
    }
    $: auto_save(value);
    // auto_save();
    function get_code({ code, es }) {
        console.log(es);
        if (es != undefined || es != null) {
            errors = es;
        }
        if (code == undefined || code == null) {
            return [];
        }
        return code;
    }
</script>

<div>
    <div id="controles">
        <button on:click={load}>load</button>
        <button on:click={save}>save</button>
    </div>
    <div>
        <button on:click={new_file}>new</button>
        <h2 id="name">{name}</h2>
    </div>
    <div id="horazantal">
        <div id="file-tree">
            {#each files as file, idx}
                <div
                    on:mouseover={() => display_delete_btn(idx)}
                    on:click={() => select_file(file.name)}
                    class="file-name"
                >
                    {#if renaming_file == idx}
                        <form>
                            <input
                                bind:value={renaming_value}
                                on:keypress={rename_if_enter}
                                id="renaming"
                                type="text"
                            />
                        </form>
                    {:else}
                        {file.name}
                    {/if}
                    {#if hover == idx}
                        <button
                            on:click|stopPropagation={() =>
                                show_file_options(idx)}
                            class="delete-btn">⋮</button
                        >
                    {/if}
                    {#if show_opt == idx}
                        <div class="opts">
                            <button>rename</button>
                            <button>delete</button>
                            <button>new</button>
                        </div>
                    {/if}
                </div>
            {/each}
        </div>
        <div id="text-wrapper">
            <textarea
                class="textarea"
                readonly
                name="editor"
                id="line-numbers"
                cols="1"
                rows={lines}
                autocorrect="off"
                spellcheck="false"
                disabled
                value={create_line_numbers()}
            />
            <div class="seperator" />
            <textarea
                class="textarea"
                name="editor"
                id="text"
                cols="50"
                rows={lines}
                autocorrect="off"
                spellcheck="false"
                bind:value
            />
            <div class="seperator" />
            <textarea
                class="textarea"
                readonly
                name="editor"
                id="compiled"
                cols="20"
                rows={lines}
                autocorrect="off"
                spellcheck="false"
                disabled
                value={get_code(compile(value))
                    .map((e) => {
                        if (e == null) {
                            return "";
                        }
                        let a = format_num(e.toString(2), 16, 2);
                        return a;
                    })
                    .join("\n")}
            />
        </div>
    </div>
    <div id="error-wrap">
        {#each errors as error}
            <h3 class="error">{error}</h3>
        {/each}
    </div>
</div>
<ContextMenu bind:this={context_menu} {items} />

<style>
    #name {
        display: inline;
        margin-left: 70px;
    }
    .opts {
        position: relative;
        left: -40px;
        top: 20px;
        background-color: black;
        padding: 5px 0px 5px 0px;
        height: 65px;
    }
    .opts > button:hover {
        background-color: #555857;
    }
    .opts > button {
        border: none;
        margin: 2px 0px 2px 0px;
        background-color: #353837;
        color: white;
        width: 100%;
        cursor: pointer;
    }
    #error-wrap {
        border: 5px solid var(--borders);
        background-color: #353837;
        margin: 5px;
        height: 200px;
    }
    .error {
        background-color: #874742;
        margin: 5px;
        padding: 3px;
        padding-bottom: 7px;
    }
    .textarea {
        border-top: 5px solid var(--borders);
        border-left: 5px solid var(--borders);
        border-bottom: 5px solid var(--borders);
        border-right: none;
        padding: 10px;
        resize: none;
    }
    .delete-btn:hover {
        background-color: #424d5e;
    }
    .delete-btn {
        /* font-size: 18px; */
        padding: 0px;
        padding-left: 10px;
        padding-right: 10px;
        margin: 0px;
        margin-left: 10px;
        margin-right: 10px;
        background-color: #353f4c;
        border: none;
        color: white;
        cursor: pointer;
    }
    #file-tree {
        margin-right: 5px;
        margin-top: 1px;
        width: 100px;
    }
    .file-name {
        display: flex;
        justify-content: space-between;
        padding: 5px;
        margin: 2px;
        background-color: #1d232b;
        color: white;
        cursor: pointer;
        width: 100%;
    }
    .file-name:hover {
        background-color: var(--button-hover);
    }
    #horazantal {
        display: flex;
    }
    #text-wrapper {
        display: flex;
    }
    #compiled {
        background-color: #353837;
        font-size: 20px;
        color: white;
        border-right: 5px solid var(--borders);
    }
    *:focus {
        outline: none;
    }
    text.middle:focus {
        outline-width: 0;
    }
    #line-numbers {
        background-color: #353837;
        font-size: 20px;
        width: 30px;
        color: white;
    }
    #controles {
        margin: 5px;
        padding: 5px;
    }
    #text {
        background-color: #353837;
        font-size: 20px;
        color: white;
    }
</style>
