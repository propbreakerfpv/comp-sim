<script>
</script>

<div id="wrapper">
    <h1 id="comp-sim-documentation">comp-sim documentation</h1>
    <h2 id="key">key</h2>
    <table>
        <thead>
            <tr>
                <th>key</th>
                <th>meaning</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>&lt;literal&gt;</td>
                <td>number</td>
            </tr>
            <tr>
                <td>&lt;reg&gt;</td>
                <td>register. see <a href="#registers">registers</a></td>
            </tr>
            <tr>
                <td>&lt;memadr&gt;</td>
                <td>memory address. [&lt;reg&gt; or &lt;literal&gt;]</td>
            </tr>
            <tr>
                <td>&lt;label&gt;</td>
                <td>label. see <a href="#labels">labels</a></td>
            </tr>
        </tbody>
    </table>
    <table>
        <thead>
            <tr>
                <th>dec</th>
                <th>hex</th>
                <th>bin</th>
                <th>asm</th>
                <th>usage</th>
                <th>def</th>
                <th>example</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>00</td>
                <td>00</td>
                <td>0000</td>
                <td>nop</td>
                <td>nop</td>
                <td>no operation</td>
                <td>nop ; do nothing</td>
            </tr>
            <tr>
                <td>01</td>
                <td>01</td>
                <td>0001</td>
                <td>hlt</td>
                <td>hlt</td>
                <td>halt the cpu</td>
                <td>hlt</td>
            </tr>
            <tr>
                <td>02</td>
                <td>02</td>
                <td>0010</td>
                <td>add</td>
                <td
                    >add &lt;reg&gt; - &lt;literal&gt;&lt;reg&gt;&lt;memadr&gt;</td
                >
                <td>add</td>
                <td>add ra 5 ; add 5 to ra</td>
            </tr>
            <tr>
                <td>03</td>
                <td>03</td>
                <td>0011</td>
                <td>sub</td>
                <td
                    >sub &lt;reg&gt; - &lt;literal&gt;&lt;reg&gt;&lt;memadr&gt;</td
                >
                <td>subtract</td>
                <td>sub ra 5 ; subtract 5 from ra</td>
            </tr>
            <tr>
                <td>04</td>
                <td>04</td>
                <td>0100</td>
                <td>wrt</td>
                <td>wrt &lt;literal&gt;&lt;reg&gt;&lt;memadr&gt;</td>
                <td>write to display</td>
                <td>wrt ra ; write the value stored in ra to the display</td>
            </tr>
            <tr>
                <td>05</td>
                <td>05</td>
                <td>0101</td>
                <td>mvm</td>
                <td>mvm &lt;literal&gt;&lt;reg&gt; - &lt;memadr&gt;</td>
                <td>move a value into memory</td>
                <td>mvm ra 15 ; move the value in ra to memory address 15</td>
            </tr>
            <tr>
                <td>06</td>
                <td>06</td>
                <td>0110</td>
                <td>mvr</td>
                <td
                    >mvr &lt;reg&gt; - &lt;literal&gt;&lt;reg&gt;&lt;memadr&gt;</td
                >
                <td>move a value into a register</td>
                <td>mvr ra 5 ; move the value 5 into ra</td>
            </tr>
            <tr>
                <td>07</td>
                <td>07</td>
                <td>0111</td>
                <td>push</td>
                <td>push &lt;reg&gt;&lt;literal&gt;&lt;memadr&gt;</td>
                <td>push to stack</td>
                <td>push ra ; push the value in ra to the stack</td>
            </tr>
            <tr>
                <td>08</td>
                <td>08</td>
                <td>1000</td>
                <td>pop</td>
                <td>push &lt;reg&gt;&lt;literal&gt;&lt;memadr&gt;</td>
                <td>pop stack into specified reg</td>
                <td>pop ra ; pop the value at the top of the stack into ra</td>
            </tr>
            <tr>
                <td>09</td>
                <td>09</td>
                <td>1001</td>
                <td>jmp</td>
                <td>jmp &lt;lable&gt;&lt;literal&gt;&lt;reg&gt;</td>
                <td>jump</td>
                <td>jump 5 ; jmp the memory address 5</td>
            </tr>
            <tr>
                <td>10</td>
                <td>0A</td>
                <td>1010</td>
                <td>jnz</td>
                <td>jnz &lt;lable&gt;&lt;literal&gt;&lt;reg&gt;</td>
                <td>jump not zero</td>
                <td
                    >jnz 5 ; if the last op didn&#39;t result in a 0 jump to 5</td
                >
            </tr>
            <tr>
                <td>11</td>
                <td>0B</td>
                <td>1011</td>
                <td>jz</td>
                <td>jz &lt;lable&gt;&lt;literal&gt;&lt;reg&gt;</td>
                <td>jump if zero</td>
                <td>jz 5 ; if the last op resulted in 0, jump to 5</td>
            </tr>
        </tbody>
    </table>
    <h1 id="assembly-syntax">assembly syntax</h1>
    <p>
        assembly is made up of statements. each statement takes up one line. a
        statement is started with and operation(see table above) followed by 0,
        1 or 2 arguments. an argument can be a literal value (numbers) or it can
        be a register (<code>ra</code>, <code>rb</code>, <code>pc</code>, etc.
        see
        <a href="#registers">registers</a>). it can also be a memory address
        (register or literal surrounded by square brackets. <code>[ra]</code> or
        <code>[10]</code>). jump operations can also take labels. a label can be
        created with name colon ie
        <code>label:</code>
    </p>
    <h2 id="arg-type-bit-layout">arg type bit layout</h2>
    <table>
        <thead>
            <tr>
                <th>mem adr</th>
                <th>literal</th>
                <th>result</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>first bit of arg1</td>
                <td>first bit of arg2</td>
            </tr>
            <tr>
                <td>1</td>
                <td>1</td>
                <td>value in mem at literal arg2</td>
            </tr>
            <tr>
                <td>1</td>
                <td>0</td>
                <td>value in mem at reg arg2</td>
            </tr>
            <tr>
                <td>0</td>
                <td>1</td>
                <td>value in literal arg2</td>
            </tr>
            <tr>
                <td>0</td>
                <td>0</td>
                <td>value in reg arg2</td>
            </tr>
        </tbody>
    </table>
    <h2 id="registers">registers</h2>
    <table>
        <thead>
            <tr>
                <th>index</th>
                <th>register</th>
                <th>use</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>0</td>
                <td>ra</td>
                <td>general register a</td>
            </tr>
            <tr>
                <td>1</td>
                <td>rb</td>
                <td>general register b</td>
            </tr>
            <tr>
                <td>2</td>
                <td>rc</td>
                <td>general register c</td>
            </tr>
            <tr>
                <td>3</td>
                <td>rd</td>
                <td>general register d</td>
            </tr>
            <tr>
                <td>4</td>
                <td>pc</td>
                <td>program counter</td>
            </tr>
            <tr>
                <td>5</td>
                <td>sp</td>
                <td>stack pointer</td>
            </tr>
            <tr>
                <td>6</td>
                <td>ir</td>
                <td>instruction register</td>
            </tr>
            <tr>
                <td>7</td>
                <td>fr</td>
                <td>flags register</td>
            </tr>
            <tr>
                <td>9</td>
                <td>cnf</td>
                <td>display config</td>
            </tr>
        </tbody>
    </table>
    <h2 id="labels">labels</h2>
    <p>
        a label is a place for a jump operation to jump to. they can be defined
        like <code>label_name:</code> and can then be referred to by name by any
        jump in the program
    </p>
    <h2 id="example-programs">example programs</h2>
    <pre><code
            ><span class="hljs-comment">; print test</span>
<span class="hljs-meta">.data</span>
    h <span class="hljs-number">72</span>
    e <span class="hljs-number">69</span>
    l <span class="hljs-number">76</span>
    l <span class="hljs-number">76</span>
    o <span class="hljs-number">79</span>
<span class="hljs-meta">.text</span>
    mvr <span class="hljs-built_in">ra</span> <span class="hljs-number">0</span>
    mvr rb <span class="hljs-number">5</span>
    <span class="hljs-keyword">jmp </span>print
<span class="hljs-symbol">    print:</span>
        mvr cnf <span class="hljs-number">1</span>
        <span class="hljs-keyword">sub </span>rb <span class="hljs-number"
                >1</span
            >
        wrt [<span class="hljs-built_in">ra</span>]
        <span class="hljs-keyword">jz </span>ret
        <span class="hljs-keyword">add </span><span class="hljs-built_in"
                >ra</span
            > <span class="hljs-number">1</span>
        <span class="hljs-keyword">jmp </span>print
<span class="hljs-symbol">    ret:</span>
        mvr pc rd
</code></pre>
    <pre><code
            ><span class="hljs-meta">.text</span>
    mvr <span class="hljs-built_in">ra</span> <span class="hljs-number">9</span>
    mvr rb <span class="hljs-number">1</span>
<span class="hljs-symbol">    loop:</span>
        <span class="hljs-keyword">sub </span><span class="hljs-built_in"
                >ra</span
            > rb
        <span class="hljs-keyword">jnz </span>loop
        hlt
</code></pre>
</div>

<style>
    a {
        all: unset;
        text-decoration-line: underline;
        cursor: pointer;
    }
    #wrapper {
        color: white;
        background-color: #353837;
    }
    th {
        background-color: #606060;
        padding: 5px;
        font-size: 18px;
        text-align: left;
    }
    td {
        padding: 2px;
        padding-left: 7px;
        padding-right: 7px;
        border-left: 2px solid black;
        /* font-size: 18px; */
        /* text-align: left; */
    }
    tr {
        border: 2px solid black;
    }
    table {
        border-collapse: collapse;
    }
    #legend {
        display: flex;
        flex-direction: column;
        margin: 10px;
        padding: 10px;
    }
</style>
