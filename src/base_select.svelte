<script>
    import { createEventDispatcher } from "svelte";

    const dispatch = createEventDispatcher();
    export let base = 10;
    function onClick(e) {
        for (let i = 0; i < e.target.parentElement.parentElement.children.length; i++) {
            e.target.parentElement.parentElement.children[i].children[0].style.backgroundColor = "";
            e.target.parentElement.parentElement.children[i].children[0].id = "";
        }
        e.target.style.backgroundColor = "#874742";
        if (e.target.innerText == "Decmal") {
            base = 10;
            dispatch('base', base);
        } else if (e.target.innerText == "Binary") {
            base = 2;
            dispatch('base', base);
        } else if (e.target.innerText == "Hex") {
            base = 16;
            dispatch('base', base);
        }
    }

</script>

<div id="wrapper">
    <div class="container">
        <button class="button" id="start" for="dec" on:click={onClick}>Decmal</button>
    </div>
    <div class="container">
        <button class="button" for="bin" on:click={onClick}>Binary</button>
    </div>
    <div class="container">
        <button class="button" for="hex" on:click={onClick}>Hex</button>
    </div>
</div>

<style>
    #start {
        background-color: #874742;
    }
    #wrapper {
        display: flex;
        color: white;
        margin: 5px;
        margin-bottom: 10px;
        justify-content: center;
        background-color: var(--section-background);
    }
    .button {
        border: none;
        font-size: 16px;
        padding: 3px;
        margin: 3px;
        border-radius: 3px;
    }
    .container {
        display: inline;
        background-color: var(--section-background);
        /* padding: 5px; */
    }
</style>
