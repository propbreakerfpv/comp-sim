<script>
</script>

<div id="legend">
    <table>
        <tr>
            <th>dec</th>
            <th>hex</th>
            <th>Binary</th>
            <th>asm</th>
            <th>def</th>
        </tr>
        <tr>
            <th>00</th>
            <th>00</th>
            <th>0000</th>
            <th>nop</th>
            <th>no oparation</th>
        </tr>
        <tr>
            <th>01</th>
            <th>01</th>
            <th>0001</th>
            <th>hlt</th>
            <th>halt the cpu</th>
        </tr>
        <tr>
            <th>02</th>
            <th>02</th>
            <th>0010</th>
            <th>add</th>
            <th>add</th>
        </tr>
        <tr>
            <th>03</th>
            <th>03</th>
            <th>0011</th>
            <th>sub</th>
            <th>subtract</th>
        </tr>
        <tr>
            <th>4</th>
            <th>4</th>
            <th>0100</th>
            <th>wrt</th>
            <th>write to display</th>
        </tr>
        <tr>
            <th>05</th>
            <th>05</th>
            <th>0101</th>
            <th>mvm</th>
            <th>move a value into memory</th>
        </tr>
        <tr>
            <th>06</th>
            <th>06</th>
            <th>0110</th>
            <th>mvr</th>
            <th>move a value into a register</th>
        </tr>
        <tr>
            <th>07</th>
            <th>07</th>
            <th>0111</th>
            <th>push</th>
            <th>push to stack</th>
        </tr>
        <tr>
            <th>08</th>
            <th>08</th>
            <th>1000</th>
            <th>op</th>
            <th>pop stack into specified register</th>
        </tr>
        <tr>
            <th>9</th>
            <th>9</th>
            <th>1001</th>
            <th>jmp</th>
            <th>jump</th>
        </tr>
        <tr>
            <th>10</th>
            <th>A</th>
            <th>1010</th>
            <th>jnz</th>
            <th>jump not zero</th>
        </tr>
        <tr>
            <th>11</th>
            <th>B</th>
            <th>1011</th>
            <th>jz</th>
            <th>jump if zero</th>
        </tr>
    </table>
</div>

<style>
    table {
        background-color: #353837;
        border-radius: 5px;
    }
    th {
        background-color: #606060;
        padding: 5px;
        font-size: 18px;
        text-align: left;
    }
    #legend {
        display: flex;
        flex-direction: column;
        margin: 10px;
        padding: 10px;
    }
</style>
