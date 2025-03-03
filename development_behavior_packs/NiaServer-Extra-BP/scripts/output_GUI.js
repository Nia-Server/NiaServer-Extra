import { system } from "@minecraft/server";
import { EQGUI } from "./equipment_enhancement";
import { error } from "./API/logger";


const ALL_GUI = ["EQGUI"];

//注册scriptevent
system.afterEvents.scriptEventReceive.subscribe((event) => {
    if (event.id != "mcnia:nx_openGUI") return;
    //openGUI后的处理
    //event.message是一个object对象，格式形如{"GUI":"GUI名称","target":"目标玩家名称","data":{}}
    //解析event.message，判断传进的数据是否是一个object对象
    let receive_data = event.message;
    //将字符串转换为对象,如果转换失败则log输出错误
    try {
        receive_data = JSON.parse(receive_data);
    } catch (e) {
        error(e);
        if (event.sourceType != "player") return;
        event.sourceEntity.sendMessage("§c json格式解析错误，请检查传入的数据是否符合json格式！\n" +
            "§b您传入的数据为：" + event.message + "\n" +
            "§a正确的格式为：{\"GUI\":\"GUI名称\",\"target\":\"目标玩家名称\",\"data\":{}}"
        );
        return;
    }
    //判断obj是否符合{"GUI":"GUI名称","target":"目标玩家名称","data":{}}
    if (receive_data.GUI == undefined || receive_data.target == undefined || receive_data.data == undefined) {
        error("The data received is not a valid object!");
        if (event.sourceType != "player") return;
        event.sourceEntity.sendMessage("§c json解析错误，请检查传入的数据是否符合预设格式！\n" +
            "§b您传入的数据为：" + event.message + "\n" +
            "§a正确的格式为：{\"GUI\":\"GUI名称\",\"target\":\"目标玩家名称\",\"data\":{}}"
        );
        return;
    }
    //获取目标玩家
    let player = world.getPlayers({name: receive_data.target})[0];
    if (player == undefined) {
        error("The target player does not exist!");
        if (event.sourceType != "player") return;
        event.sourceEntity.sendMessage("§c 未找到目标玩家！请检查玩家名称是否正确！");
        return;
    }
    //打开GUI
    //判断GUI是否存在
    if (ALL_GUI.indexOf(receive_data.GUI) == -1) {
        error("The GUI does not exist!");
        if (event.sourceType != "player") return;
        event.sourceEntity.sendMessage("§c 未找到相应的GUI！请检查GUI名称是否正确！");
        return;
    }
    OpenGUI(player,receive_data.GUI);
});

function OpenGUI(player, GUINAME) {
    const GUIs = {
        EQGUI: () => EQGUI.Main(player)
    }
    ;(GUIs[GUINAME] || (() => {
        player.sendMessage("§c 未找到相应的GUI，请联系管理员！")
    }))()
}
