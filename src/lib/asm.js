export default function compile(code) {
    if (code == null || code == undefined) {
        return { code: [], es: [] };
    }
    let tokens = new Parser(code).parse();
    let compiler = new Compiler(tokens);
    let ret = compiler.compile();
    if (compiler.errored) {
        return { code: undefined, es: compiler.errors };
    }
    return { code: ret, es: compiler.errors };
}

function is_letter(char) {
    return char.match(/^[A-Za-z_.]+$/);
}
function is_num(char) {
    return char.match(/^[0-9]+$/);
}

function ident_lookup(ident) {
    if (ident == "mvr") {
        return "MVR"
    } else if (ident == "mvm") {
        return "MVM"
    } else if (ident == ".data") {
        return "DATA"
    } else if (ident == ".text") {
        return "TEXT"
    } else if (ident == ".bss") {
        return "BSS"
    } else if (ident == "nop") {
        return "NOP"
    } else if (ident == "hlt") {
        return "HLT"
    } else if (ident == "add") {
        return "ADD"
    } else if (ident == "sub") {
        return "SUB"
    } else if (ident == "wrt") {
        return "WRT"
    } else if (ident == "push") {
        return "PUSH"
    } else if (ident == "pop") {
        return "POP"
    } else if (ident == "jmp") {
        return "JMP"
    } else if (ident == "jnz") {
        return "JNZ"
    } else if (ident == "jz") {
        return "JZ"
    } else if (ident == "ra") {
        return "REG"
    } else if (ident == "rb") {
        return "REG"
    } else if (ident == "rc") {
        return "REG"
    } else if (ident == "rd") {
        return "REG"
    } else if (ident == "pc") {
        return "REG"
    } else if (ident == "sc") {
        return "REG"
    } else if (ident == "cnf") {
        return "REG"
    } else {
        return "IDENT"
    }
}

class Token {
    constructor(tt, literal) {
        this.token_type = tt;
        this.literal = literal;
    }
}

class Parser {
    constructor(code) {
        this.code = code;
        this.pos = 0;
        this.peek = 1;
        this.char = code[0];
        this.read_char();
    }
    parse() {
        let tokens = [];
        for (let idx = 0; idx < 100000; idx++) {
            if (this.eof()) {
                break;
            }
            tokens.push(this.next_token());
        }
        tokens.push(new Token("EOF", ""));
        return tokens;
    }
    next_token() {
        this.skip_whitespace();

        let token;
        if (this.char == ":") {
            token = new Token("COLIN", ":")
        } else if (this.char == "[") {
            token = new Token("LSQUAR", "[")
        } else if (this.char == "]") {
            token = new Token("RSQUAR", "]")
        } else if (this.char == ";") {
            token = new Token("SEMI", ";")
        } else if (this.char == "\0") {
            token = new Token("EOF", "\0")
        } else if (this.char == "\n") {
            token = new Token("NL", "\n")
        } else {
            if (is_letter(this.char)) {
                let literal = this.read_ident();
                return new Token(ident_lookup(literal), literal);
            } else if (is_num(this.char)) {
                return new Token("NUM", this.read_num());
            } else {
                token = new Token("ELIGAL", this.char);
            }
        }
        this.read_char();
        return token;
    }
    read_char() {
        if (this.pos >= this.code.length) {
            this.char = "\0";
        } else {
            this.char = this.code[this.pos];
        }
        this.pos = this.peek;
        this.peek += 1;
    }
    read_num() {
        let num = [];
        for (let idx = 0; is_num(this.char) && idx < 10000; idx++) {
            num.push(this.char);
            this.read_char();
        }
        return num.join("");
    }
    read_ident() {
        let s = [];
        for (let idx = 0; is_letter(this.char) && idx < 1000; idx++) {
            s.push(this.char);
            this.read_char();
            if (this.eof()) {
                break;
            }
        }
        return s.join("");
    }
    eof() {
        return this.pos > this.code.length;
    }
    skip_whitespace() {
        for (let idx = 0; idx < 10000; idx++) {
            if (this.char.includes(" ") || this.char.includes("\t" || this.char.includes("\r"))) {
                this.read_char();
            } else {
                break;
            }
        }
    }
}

function create_zeros(len) {
    let out = [];
    for (let i = 0; i < len; i++) {
        out.push("0");
    }
    return out.join("");
}
function get_reg(reg, len) {
    if (reg == "ra") {
        return create_zeros(len - 1) + "0";
    } else if (reg == "rb") {
        return create_zeros(len - 1) + "1";
    } else if (reg == "rc") {
        return create_zeros(len - 2) + "10";
    } else if (reg == "rd") {
        return create_zeros(len - 2) + "11";
    } else if (reg == "pc") {
        return create_zeros(len - 3) + "100";
    } else if (reg == "sp") {
        return create_zeros(len - 3) + "101";
    } else if (reg == "cnf") {
        return create_zeros(len - 3) + "110";
    } else {
        return null;
    }
}
function num_to_bin(num) {
    num = Number(num).toString(2);
    if (isNaN(num)) {
        return null;
    }
    return num;
}
function is_inst(inst) {
    if (inst == "MVR") {
        return true;
    } else if (inst == "MVM") {
        return true;
    } else if (inst == "NOP") {
        return true;
    } else if (inst == "HLT") {
        return true;
    } else if (inst == "ADD") {
        return true;
    } else if (inst == "SUB") {
        return true;
    } else if (inst == "WRT") {
        return true;
    } else if (inst == "PUSH") {
        return true;
    } else if (inst == "POP") {
        return true;
    } else if (inst == "JMP") {
        return true;
    } else if (inst == "JNZ") {
        return true;
    } else if (inst == "JZ") {
        return true;
    } else {
        return false;
    }
}


class Compiler {
    constructor(tokens = [], ram_size = 15) {
        this.tokens = tokens;
        this.pos = 0;
        this.token = this.tokens[0];
        this.line = 0;
        this.ram_size = ram_size;
        this.errored = false;
        this.labels = {}
        this.vars = {};
        this.comment = false;
        this.errors = [];
        this.addr = 0;
    }
    error(msg) {
        console.error("compiler error: " + msg + " on line " + this.line);
        this.errors.push("compiler error: " + msg + " on line " + this.line)
        this.errored = true;
    }
    compile() {
        this.hoist();
        let mem = [];
        while (this.pos < this.tokens.length && this.token.token_type != "EOF") {
            if (this.token.token_type == "DATA") {
                this.advance();
                this.advance();
                this.line += 1;
                let ret = this.compile_data();
                if (ret != undefined) {
                    ret.forEach((e) => mem.push(e));
                }
            } else if (this.token.token_type == "TEXT") {
                this.advance();
                this.advance();
                this.line += 1;
                let ret = this.compile_text();
                if (ret != undefined) {
                    ret.forEach((e) => mem.push(e));
                }
            } else {
                return this.error(`expected .text or .data found ${this.token.literal}`)
            }
        }
        return mem
    }
    compile_data() {
        let lines = [];
        while (this.pos < this.tokens.length && this.token.token_type != "EOF") {
            if (this.token.token_type == "TEXT") {
                break;
            }
            if (this.token.token_type != "IDENT") {
                return this.error(`expected ident found '${this.token.literal}'`);
            }
            let name = this.token.literal;
            console.log("var will be", this.addr)
            this.vars[name] = this.addr;
            this.advance();

            if (this.token.token_type != "NUM") {
                return this.error(`expected number found ${this.token.literal}`)
            }
            let num = num_to_bin(this.token.literal);
            lines.push(create_zeros(16 - num.length) + num)
            this.advance();
            if (this.token.token_type != "NL") {
                return this.error(`expected newline found ${this.token.literal}`);
            }
            this.line += 1;
            this.addr += 1;
            this.advance();
        }
        return lines
    }
    compile_text() {
        let lines = [];
        while (this.pos < this.tokens.length && this.token.token_type != "EOF") {
            if (this.token.token_type == "DATA") {
                break;
            }

            let line = this.compile_line();
            if (line != null && line != undefined) {
                lines.push(create_zeros(16 - line.toString(2)) + line.toString(2));
            }
            if (this.token.token_type == ";") {
                this.comment = true;
            }
            if (this.comment) {
                while (this.token.token_type != "NL" && this.token.token_type != "EOF") {
                    this.advance();
                }
                this.comment = false;
            }
            if (this.token.token_type != "NL" && this.token.token_type != "EOF") {
                return this.error(`expected new line found '${this.token.literal}'.`)
            }
            this.line += 1;
            if (this.errored) {
                break;
            }
            this.advance()
        }
        return lines;
    }
    hoist() {
        let pos = 0;
        let curTok;
        let peek;
        let addr = 0;
        let section = ""
        while (pos < this.tokens.length - 1) { // - 1 because of the peek token
            curTok = this.tokens[pos];
            peek = this.tokens[pos + 1];
            if (curTok.token_type == "TEXT") {
                section = "text";
            }
            if (curTok.token_type == "DATA") {
                section = "data";
            }
            if (section == "data") {
                if (curTok.token_type == "IDENT") {
                    addr += 1;
                }
            } else if (section == "text") {
                if (is_inst(curTok.token_type)) {
                    addr++;
                }
            }
            if (curTok.token_type == "IDENT" && peek.token_type == "COLIN") {
                if (Object.keys(this.labels).includes(curTok.literal)) {
                    return this.error(`lable '${curTok.literal}' is already defined on line ${this.labels[curTok.literal]}.`);
                }
                this.labels[curTok.literal] = addr;
            }
            pos++;
        }
    }
    compile_line() {
        if (this.token.token_type == "MVM") {
            return this.compile_mvm();
        } else if (this.token.token_type == "IDENT") {
            return this.compile_ident();
        } else if (this.token.token_type == "MVR") {
            return this.compile_mvr();
        } else if (this.token.token_type == "HLT") {
            return this.compile_hlt();
        } else if (this.token.token_type == "NOP") {
            return this.compile_nop();
        } else if (this.token.token_type == "ADD") {
            return this.compile_add();
        } else if (this.token.token_type == "SUB") {
            return this.compile_sub();
        } else if (this.token.token_type == "WRT") {
            return this.compile_wrt();
        } else if (this.token.token_type == "PUSH") {
            return this.compile_push();
        } else if (this.token.token_type == "POP") {
            return this.compile_pop();
        } else if (this.token.token_type == "JMP") {
            return this.compile_jmp();
        } else if (this.token.token_type == "JNZ") {
            return this.compile_jnz();
        } else if (this.token.token_type == "JZ") {
            return this.compile_jnz();
        }
    }
    compile_ident() {
        this.advance();
        if (this.token.token_type != "COLIN") {
            return this.error(`expected colin got '${this.token.literal}'`)
        }
        this.advance();
        return null;
    }
    compile_jnz() {
        let out = ["1010"];
        this.advance();
        this.addr++;
        return this.compile_value_lable(out);
    }
    compile_jz() {
        let out = ["1011"];
        this.advance();
        this.addr++;
        return this.compile_value_lable(out);
    }
    compile_jmp() {
        let out = ["1001"];
        this.advance();
        this.addr++;
        return this.compile_value_lable(out);
    }
    compile_pop() {
        let out = ["1000", "0000"];
        this.advance();

        if (this.token.token_type != "REG") {
            return this.error(`expected register found ${this.token.literal}`);
        }
        out.push(get_reg(this.token.literal, 8));
        this.advance();
        this.addr++;
        return Number("0b" + out.join(""));
    }
    compile_push() {
        let out = ["0111"];
        this.advance();
        this.addr++;
        return this.compile_value(out);
    }
    compile_wrt() {
        let out = ["0100"];
        this.advance();
        this.addr++;
        return this.compile_value(out);
    }
    compile_value_lable(out) {
        let memaddr = false;
        if (this.token.token_type == "LSQUAR") {
            memaddr = true;
            if (this.advance()) {
                return this.error("expected register or number");
            }
        }
        let value = get_reg(this.token.literal, 8)
        let variable = false;
        let literal = false;
        if (this.token.token_type == "IDENT" && this.vars[this.token.literal] != undefined) {
            variable = true;
            literal = true;
            let v = this.vars[this.token.literal].toString(2);
            value = create_zeros(8 - v.length) + v;
        }
        // let literal_val;
        if (value == null) {
            literal = true;
            value = num_to_bin(this.token.literal);
            if (value == null) {
                if (this.token.token_type == "IDENT") {
                    let v = num_to_bin(this.labels[this.token.literal]);
                    if (v != null) {
                        value = create_zeros(8 - v.length) + v;
                    }
                }
                if (value == null) {
                    return this.error(`expected number, lable, or register, found ${this.token.literal}`);
                }
            }
        }
        if (this.advance() && memaddr && this.token.token_type == "RSQUAR") {
            return this.error("expected ']'");
        }
        if (memaddr && !this.token.token_type == "RSQUAR") {
            return this.error(`expected closing square bracket, found ${this.token.literal}. `)
        } else if (!memaddr && this.token.token_type == "RSQUAR") {
            return this.error(`unexpected closing square bracket.`)
        } else if (memaddr && this.token.token_type == "RSQUAR") {
            this.advance();
        }

        let o = [];
        if (memaddr || variable) {
            o.push("1")
        } else {
            o.push("0")
        }
        if (literal) {
            o.push("1");
        } else {
            o.push("0");
        }
        out.push(o.join("") + "00")
        out.push(value);
        return Number("0b" + out.join(""));
    }
    compile_value(out) {
        let memaddr = false;
        if (this.token.token_type == "LSQUAR") {
            memaddr = true;
            if (this.advance()) {
                return this.error("expected register or number");
            }
        }
        let value = get_reg(this.token.literal)

        let variable = false
        let literal = false;
        console.log("this.vars", this.vars);
        if (this.token.token_type == "IDENT" && this.vars[this.token.literal] != undefined) {
            variable = true;
            literal = true;
            let v = this.vars[this.token.literal].toString(2);
            value = create_zeros(8 - v.length) + v;
        }

        if (value == null) {
            literal = true;
            value = num_to_bin(this.token.literal);
            if (value == null) {
                return this.error(`expected number or register, found ${this.token.literal}`);
            }
        }
        value = create_zeros(8 - value.length) + value;

        if (this.advance() && memaddr && this.token.token_type == "RSQUAR") {
            return this.error("expected ']'");
        }
        if (memaddr && !this.token.token_type == "RSQUAR") {
            return this.error(`expected closing square bracket, found ${this.token.literal}. `)
        } else if (!memaddr && this.token.token_type == "RSQUAR") {
            return this.error(`unexpected closing square bracket. `)
        } else if (memaddr && this.token.token_type == "RSQUAR") {
            this.advance();
        }

        let o = [];
        if (memaddr || variable) {
            o.push("1")
        } else {
            o.push("0")
        }
        if (literal) {
            o.push("1");
        } else {
            o.push("0");
        }
        out.push(o.join("") + "00")
        out.push(value)
        return Number("0b" + out.join(""));
    }
    compile_sub() {
        let out = ["0011"];
        this.advance();
        this.addr++;
        return this.compile_reg_value(out);
    }
    compile_add() {
        let out = ["0010"];
        this.advance();
        this.addr++;
        return this.compile_reg_value(out);
    }
    compile_reg_value(out) {
        let reg = get_reg(this.token.literal, 3);
        if (reg == null) {
            return this.error(`'${this.token.literal}' is not a register`);
        }
        if (this.advance()) {
            return this.error("expected '[', register or number");
        }
        let memaddr = false;
        if (this.token.token_type == "LSQUAR") {
            memaddr = true;
            if (this.advance()) {
                return this.error("expected number or register");
            }
        }
        let reg2 = get_reg(this.token.literal)
        let variable = false;
        let literal = false;
        let literal_val;
        if (this.token.token_type == "IDENT" && this.vars[this.token.literal] != undefined) {
            variable = true;
            literal = true;
            literal_val = num_to_bin(this.vars[this.token.literal]);
            reg2 = "";
        }
        if (reg2 == null) {
            literal = true;
            literal_val = num_to_bin(this.token.literal);
            if (literal_val == null) {
                return this.error(`expected number or register, found ${this.token.literal}`);
            }
        }
        let arg2;
        if (literal) {
            arg2 = create_zeros(7 - literal_val.length) + literal_val;
        } else {
            arg2 = create_zeros(7 - reg2.length) + reg2;
        }

        if (this.advance() && memaddr && this.token.token_type == "RSQUAR") {
            return this.error("expected ]");
        }
        if (memaddr && !this.token.token_type == "RSQUAR") {
            return this.error(`expected closing square bracket, found ${this.token.literal}. `)
        } else if (!memaddr && this.token.token_type == "RSQUAR") {
            return this.error(`unexpected closing square bracket. `)
        } else if (memaddr && this.token.token_type == "RSQUAR") {
            this.advance();
        }

        if (memaddr || variable) {
            out.push("1" + reg)
        } else {
            out.push("0" + reg)
        }
        if (literal) {
            out.push("1" + arg2);
        } else {
            out.push("0" + arg2);
        }
        return Number("0b" + out.join(""));
    }
    compile_nop() {
        this.advance();
        this.addr++;
        return 0b0000000000000000
    }
    compile_hlt() {
        this.advance();
        this.addr++;
        return 0b0001000000000000
    }
    compile_mvr() {
        let out = ["0110"];
        this.advance();
        this.addr++;
        return this.compile_reg_value(out);
    }
    compile_mvm() {
        // mvm ra 0xff
        let out = ["0101"];
        if (this.advance()) {
            return this.error("expected register or number");
        }
        if (this.token.token_type == "REG") {
            out.push("0" + get_reg(this.token.literal, 3));
        } else if (this.token.token_type == "NUM") {
            let num = num_to_bin(this.token.literal);
            if (num.length > 3) {
                return this.error(`value ${this.token.literal} is to large to be stored in a mvm oparation. values can be from 0 - 7`);
            }
            num = create_zeros(3 - num.length) + num;
            out.push("1" + num);
        } else {
            return this.error(`invalid token on line ${this.line}`, this.token.literal);
        }
        if (this.advance()) {
            return this.error(`expected memory address or register`);
        }
        let num = num_to_bin(this.token.literal);
        if (num == null) {
            if (this.token.token_type == "IDENT" && this.vars[this.token.literal] != undefined) {
                let v = num_to_bin(this.vars[this.token.literal]);
                num = "1" + create_zeros(7 - v.length) + v;
            } else {
                num = "0" + get_reg(this.token.literal, 7)
            }
        } else {
            num = "1" + create_zeros(7 - num.length) + num;
        }
        // todo this will be a problem if the ram size is smaller then the register number. should only be a theoretical problem but...
        if (Number(this.token.literal) > this.ram_size) {
            return this.error(`memory address ${this.token.literal} larger then the ram. memory addresses can be from 0 - ${this.ram_size}`);
        }
        out.push(num)
        this.advance();
        this.addr++;
        return Number("0b" + out.join(""))
    }
    advance() {
        this.pos++;
        this.token = this.tokens[this.pos]
        if (this.token == undefined) {
            // console.warn("unexpected eof")
            this.token = ""
        }
        if (this.token.token_type == "SEMI") {
            this.comment = true;
            return true;
        }
        return false;
    }
}

