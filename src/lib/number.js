export default function format_num(num, max, base) {
    let out = [];
    if (base == 2) {
        while (num.length < max) {
            num = "0" + num;
        }
        let idx = 0;
        for (let i of num) {
            if (idx % 4 == 0 && idx > 0) {
                out.push(" ");
            }
            out.push(i);
            idx++;
        }
    } else {
        return num
    }
    return out.join("")
}
