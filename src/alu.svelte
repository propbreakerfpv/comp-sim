<script>
    export let mode = "add";
    export let a = 0;
    export let b = 0;
    let output = a + b;
</script>

<div id="wrapper">
    <h3 class="h3">arithmetic logic unit</h3>
    <div id="wrapper2">
    <div id="io">
        <h3 class="h3">input a</h3>
        <div class="io">{a}</div>
        <h3 class="h3">output</h3>
        <div class="io">{output}</div>
        <h3 class="h3">input b</h3>
        <div class="io">{b}</div>
    </div>
    <div>
        {#if mode == "add"}
            <h5 class="mode" id="active">add</h5>
            <h5 class="mode">subtract</h5>
        {:else if mode == "sub"}
            <h5 class="mode">add</h5>
            <h5 class="mode" id="active">subtract</h5>
        {/if}
    </div>
    </div>
</div>

<style>
    #wrapper2 {
        display: flex;
    }
    #wrapper {
        display: flex;
        flex-direction: column;
        background-color: #353837;
        width: 225px;
        margin: 10px;
        padding: 10px;
        border-radius: 5px;
    }
    #io {
        width: 200px;
        display: flex;
        flex-direction: column;
    }
    .mode {
        margin: 0px;
        padding: 5px;
        color: white;
    }
    #active {
        color: red;
    }
    .io {
        margin: 5px;
        padding: 5px;
        background-color: #606060;
        border-radius: 5px;
    }
    .h3 {
        margin: 0px;
        padding: 5px;
        color: white;
    }
</style>
