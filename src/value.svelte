<script>

    export let base = 10;
    export let value = 0;
</script>

<input class="val" bind:value={value} />

<style>
    .val {
        font-size: 1rem;
        margin: 5px;
        padding: 5px;
        width: 165px;
        background-color: var(--background);
        border-radius: 5px;
        border: none;
    }
</style>
