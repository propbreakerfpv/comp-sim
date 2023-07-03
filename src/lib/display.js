export default function write(display, cursor, config, value) {
    if ((config & 1) == 1) {
        display[cursor] = String.fromCharCode(value);
        cursor ++;
    } else if ((config & 1) == 0) {
        let idx = 0;
        console.log("wrt value", value.toString(10))
        for (let char of value.toString(10)) {
            display[idx] = char;
            idx ++;
        }
        cursor = idx;
    }
    return [display, cursor, config];
}
