//此脚本仅用于il2cpp,或者你已经知道有那些函数要hook
var debug_database = {};
function create_debug_menu() {
    build_dic();
    var menu1 = modmenu.create('test mod',
        [
            {
                'id': '4',
                'type': 'webview',
                'data': '<!DOCTYPE html><html><body><div class="button-bar"><div id="times"><font color="red" onclick="sortbytimes();"><b>总次数</b></font></div><div id="delta"><font color="red" onclick="sortbydelta();"><b>增量</b></font></div><div id="clear"><font color="red" onclick="cclear();"><b>清空</b></font></div><div id="checkbox1"><input type="checkbox" checked="false" onclick="autorefresh(checked);"><font color="red"><b>自动刷新</b></font></div></div><style>.button-bar {display: flex;flex-direction: row;justify-content: space-between;}.button-bar>div {flex: 1;margin: 5px;text-align: center;}</style><dl id="list1"></dl><script>var sortmode = "times";function sortbydelta() {sortmode = "delta";refresh();}function sortbytimes() {sortmode = "times";refresh();}function cclear() {jsCallMethod("清除", "clear", function (a) {document.getElementById("list1").innerHTML = a;});}var intervalID;function autorefresh(checked) {if (checked) { intervalID = setInterval(refresh, 1000,sortmode); }else { clearInterval(intervalID); }}function refresh() {jsCallMethod("refresh", sortmode, function (a) {document.getElementById("list1").innerHTML = a;});}</script></body></html>'
            }
        ]
        , {
            onchange: function (result) {
                //console.log(result);
            },
            webviewcallback: function (result) {
                //console.log(result);
                var result = JSON.parse(result);
                if (result.method == 'onload') {
                    //console.log('init');
                }
                else if (result.method == 'refresh') {
                    propName = result.args;
                    menu1.webviewcall(result.id, refreshed());
                }
                else if (result.method == '清除') {
                    build_dic();
                    menu1.webviewcall(result.id, refreshed());
                }
            }
        });

}
var propName = "times";
function build_dic() {
    for (var i = 0; i < findfunction.length; i += 1) {
        var key = "0x" + findfunction[i].toString(16);
        debug_database[key] = { times: 0, delta: 0 };
    }
    
}
function refreshed() {
    var start = "";
    var list = findfunction.map(function (offset) {
        var key = "0x" + offset.toString(16);
        var value = debug_database[key];
        return { key: key, times: value.times, delta: value.delta };
    });
    list.sort(function (a, b) {
        return b[propName] - a[propName];
    });
    for (var i = 0; i < list.length; i += 1) {
        start += ("<div >" + '<font color="white"><b>' + list[i].key + ":" + list[i].times + "△:" + list[i].delta + '</b></font>' + "</div>");
        debug_database[list[i].key].delta = 0;
    }
    return start;
}
function findfun(addrArray) {
    for (var i = 0; i < addrArray.length; i++) {
        //console.log(addrArray[i]);
        var aRVA = BaseAddr.add(addrArray[i]);
        Interceptor.attach(aRVA, {
            onEnter: function (args) {
                //console.log('111');
                var arrtmp = this.context.pc.sub(Module.findBaseAddress("libil2cpp.so"));
                //console.log(arrtmp);//启用这个可能会导致系统卡顿
                debug_database[arrtmp].times += 1;
                debug_database[arrtmp].delta += 1;
                //for (var i = 0; i < addrArray.length; i++) {debugwideget[i + 2].timess += 1;}
            }, onLeave: function (retval) {
                //console.log(retval.toInt());
            }
        });
    }
}
var BaseAddr = Module.findBaseAddress("libil2cpp.so");
var findfunction = [];//填入所有函数相对偏移
create_debug_menu();
findfun(findfunction);
