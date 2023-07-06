<script>
    import compile from "./lib/asm";
    import format_num from "./lib/number";
    import { browser } from "$app/environment";
    import sleep from "./lib/helpers";
    import ContextMenu from "./context_menu.svelte";

    export let editing;
    export let ram;
    let file_names = { names: [] };
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
            if (localStorage.getItem("files") == null) {
                localStorage.setItem('{"names": []}');
            }
            file_names = JSON.parse(localStorage.getItem("files"));
            for (let f of file_names.names) {
                if (browser && localStorage) {
                    files.push({ name: f, value: localStorage.getItem(f) });
                }
            }

            if (localStorage.getItem("__context__") == null) {
                localStorage.setItem(
                    "__context__",
                    JSON.stringify({ file_name: "unnamed" })
                );
            }
            context = JSON.parse(localStorage.getItem("__context__"));
            name = context.file_name;
        }
    } catch (e) {
        console.error("failed to read from localStorage", e);
    }

    function rename_file() {
        console.log("renameing", selected_file);
        renaming_file = selected_file;
    }
    function rename_if_enter(e) {
        if (e.key == "Enter") {
            let old_name = files[renaming_file].name;
            if (name == old_name) {
                name = renaming_value;
                context.file_name = name;
            }
            // console.log("files len", files.length);
            files = files.map((e) => {
                if (e.name == old_name) {
                    e.name = renaming_value;
                    console.log("e???", e);
                }
                return e;
            });
            // console.log("files", files);

            // WHAT THE ACTUAL FUCK DO I NEED THIS FOR
            // the map on files above this is somehow duplicating items and changing the value
            // thing to file. i cant even remember what its call thats how frazled my brain is
            // from debuging this lol
            // now it not happening????????? WHAT THE FUCK IS GOING ON
            files = files.filter((e) => {
                // console.log("e??????", e)
                e.file == undefined;
            });

            if (browser && localStorage) {
                localStorage.removeItem(old_name);
            }
            // console.log("files", files);
            file_names.names = file_names.names.map((e, i) => {
                if (i == renaming_file) {
                    return renaming_value;
                } else {
                    return e;
                }
            });
            // console.log("files", files, "file_names", file_names);
            save();
            renaming_file = null;
            console.log(e);
        }
    }
    function delete_file() {
        console.log("deleting", selected_file);
        let name = files[selected_file].name;
        files = files.filter((_, i) => i != selected_file);
        file_names.names = file_names.names.filter((e) => e != name);

        if (browser && localStorage) {
            console.log("name", name);
            localStorage.setItem("files", JSON.stringify(file_names));
            localStorage.removeItem(name);
        }
    }
    function new_file() {
        save();
        value = "";
        name = "unnamed";
        files.push({name: "unnamed", value: ""});
        file_names.names.push("unnamed");
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
        console.log("saving");
        if (browser && localStorage) {
            if (localStorage.getItem(name) == null) {
                if (!file_names.names.includes(name)) {
                    file_names.names.push(name);
                }
                localStorage.setItem("files", JSON.stringify(file_names));
                files.push({ name: name, file: value });
                files = files; // we reasign files so svelte will rerender the file tree...
                localStorage.setItem(name, value);
            } else {
                localStorage.setItem(name, value);
                value = value;
            }
        }
    }
    function select_file(file) {
        if (browser && localStorage) {
            if (value.length > 0) {
                save();
            }
            value = localStorage.getItem(file);
            name = file;
            context.file_name = file;
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
    async function auto_save() {
        while (true) {
            if (name != "unnamed") {
                // console.log("saving");
                save();
            }
            await sleep(10000);
        }
    }
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
                <div class="file-name-wrapper">
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
                </div>
            {/each}
        </div>
        <div id="text-wrapper">
            <textarea
                class="textarea"
                readonly
                name="editor"
                id="line-numbers"
                cols="2"
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
        background-color: #353837;
        margin: 5px;
        height: 200px;
    }
    .error {
        background-color: red;
        margin: 5px;
        padding: 3px;
    }
    .textarea {
        border-top: 5px solid yellow;
        border-left: 5px solid yellow;
        border-bottom: 5px solid yellow;
        border-right: none;
    }
    /* .seperator { */
    /*     background-color: yellow; */
    /*     width: 5px; */
    /* } */
    .file-name-wrapper {
        display: flex;
        height: 35px;
    }
    .delete-btn:hover {
        background-color: #6c706f;
    }
    .delete-btn {
        /* font-size: 18px; */
        padding: 0px;
        padding-left: 5px;
        padding-right: 5px;
        margin: 0px;
        margin-left: 5px;
        background-color: #353837;
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
        background-color: #353837;
        color: white;
        cursor: pointer;
        width: 100%;
    }
    .file-name:hover {
        background-color: #4a4c4b;
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
        border-right: 5px solid yellow;
    }
    #line-numbers {
        background-color: #353837;
        font-size: 20px;
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
