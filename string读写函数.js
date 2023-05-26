function readilstring(pointer) {
    var string_class = pointer;
    var m_stringLength = Memory.readInt(string_class.add(0x10));
    var m_firstChar = string_class.add(0x14);
    return (m_firstChar.readUtf16String(m_stringLength));
}
function writeilstring(pointer, str) {
    var string_class = pointer;
    Memory.writeInt(string_class.add(0x10), str.length);
    return (string_class.add(0x14)).writeUtf16String(str);
}
//pointer就是string的指针可以直接把形如 public string a(){}这样的函数的返回值直接填入pointer的位置
