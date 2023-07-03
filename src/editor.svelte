<script>
    import compile from "./lib/asm";
    import format_num from "./lib/number";
    import { browser } from "$app/environment";
    import sleep from "./lib/helpers";

    export let editing;
    export let ram;
    let file_names = { names: [] };
    let files = [];
    let name = "unnamed";
    let hover = null;

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
        }
    } catch (e) {
        console.error("failed to read from localStorage", e);
    }

    let lines = 16;
    function create_line_numbers() {
        let out = [];
        for (let i = 0; i < lines; i++) {
            out.push(i.toString() + "       ");
        }
        return out.join("");
    }
    let value = "";
    // compile("hello")
    function load() {
        let comp = compile(value);
        for (let i = 0; i < ram.length; i++) {
            if (comp[i] != null && comp[i] != undefined) {
                ram[i] = Number("0b" + comp[i]);
            } else {
                ram[i] = 0;
            }
        }
        editing = false;
    }
    function save() {
        if (browser && localStorage) {
            if (localStorage.getItem(name) == null) {
                file_names.names.push(name);
                localStorage.setItem("files", JSON.stringify(file_names));
                localStorage.setItem(name, value);
            }
        }
    }
    function select_file(e) {
        let file = e.target.innerText;
        if (browser && localStorage) {
            if (value.length > 0) {
                save();
            }
            value = localStorage.getItem(file);
            name = file;
        }
    }
    function display_delete_btn(idx) {
        hover = idx;
    }
    function delete_file(name) {
        localStorage.removeItem(name.name);
        files = files.filter((e) => e.name != name.name);
        file_names.names = file_names.names.filter((e) => e != name.name);
        localStorage.setItem("files", JSON.stringify(file_names));
    }
    async function auto_save() {
        while (true) {
            if (name != "unnamed") {
                console.log("saving");
                save();
            }
            await sleep(10000);
        }
    }
    auto_save();
</script>

<div>
    <div id="controles">
        <button on:click={load}>load</button>
        <button on:click={save}>save</button>
    </div>
    <div><input type="text" bind:value={name} /></div>
    <div id="horazantal">
        <div id="file-tree">
            {#each files as file, idx}
                <div class="file-name-wrapper">
                    <div
                        on:mouseover={() => display_delete_btn(idx)}
                        on:click={select_file}
                        class="file-name"
                    >
                        {file.name}
                    </div>
                    {#if hover == idx}
                        <button
                            on:click|stopPropagation={() => delete_file(file)}
                            class="delete-btn">🗑</button
                        >
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
                value={compile(value)
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
</div>

<style>
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
    }
    .delete-btn:hover {
        background-color: #6c706f;
    }
    .delete-btn {
        font-size: 18px;
        padding: 0px;
        padding-left: 5px;
        margin: 0px;
        background-color: #353837;
        border: none;
        color: white;
        cursor: pointer;
    }
    #file-tree {
        margin-right: 5px;
        margin-top: 1px;
    }
    .file-name {
        display: flex;
        justify-content: space-between;
        padding: 5px;
        margin: 2px;
        background-color: #353837;
        color: white;
        cursor: pointer;
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
