import { world,system } from "@minecraft/server";
import { log } from "./API/logger";

world.afterEvents.worldInitialize.subscribe((event) => {

    //检测服务器是否初始化
    if (world.getDynamicProperty("state") == null) {
        //中文输出
        log("NiaServer-Extra 第一次在这个世界上运行，开始初始化...");
        world.scoreboard.addObjective("side_bar","§b==§1N§2i§3aS§4e§5r§6v§7e§8r§b==")
        log("NiaServer-Extra 初始化完成...");
        world.setDynamicProperty("state",true);
        world.scoreboard.setObjectiveAtDisplaySlot("Sidebar",{"objective": world.scoreboard.getObjective("side_bar")});
    } else if (world.getDynamicProperty("state") == true) {
        log("NiaServer-Extra 已在这个世界上初始化过...");
        world.scoreboard.addObjective("side_bar","§b==§1N§2i§3aS§4e§5r§6v§7e§8r§b==")
        world.scoreboard.setObjectiveAtDisplaySlot("Sidebar",{"objective": world.scoreboard.getObjective("side_bar")});
    }

})


const side_bar = [
    {
        "type" : "text",
        "text" : "V8-海洋生存"
    }
]

let last_tick = system.currentTick;

let type_id = 0;
let now_time = Date.now();

system.runInterval(()=>{
    if (Date.now()-now_time<1000) return;
    world.scoreboard.removeObjective("side_bar");
    // Create an array of color sequences for the rainbow effect
    const colorPatterns = [
        "§4N§ci§6a§eS§2e§ar§bv§3e§1r",
        "§1N§4i§ca§6S§ee§2r§av§be§3r",
    ];

    // Add objective with current color pattern
    world.scoreboard.addObjective("side_bar", `${colorPatterns[type_id]}`);

    type_id = (type_id + 1) % 2;
    world.scoreboard.setObjectiveAtDisplaySlot("Sidebar",{"objective": world.scoreboard.getObjective("side_bar"),"sortOrder": 0});
    world.scoreboard.getObjective("side_bar").setScore("   §c-§b----------§c-",0);
    world.scoreboard.getObjective("side_bar").setScore("§b      V8-海洋生存",1);
    world.scoreboard.getObjective("side_bar").setScore("§b   ------------",2);
    //时间
    let tick = system.currentTick;
    world.scoreboard.getObjective("side_bar").setScore("§e      TPS： §c"+((tick-last_tick)/((Date.now()-now_time)/1000)).toFixed(2),3);
    now_time = Date.now();
    last_tick = tick;

    //显示 当前几点几分几秒,形式如 00:00:00
    let now_date = new Date();
    let date = new Date(now_date.getTime() + 28800000);
    let hour = date.getHours();
    let minute = date.getMinutes();
    let second = date.getSeconds();
    let time = `${hour<10?"0"+hour:hour}:${minute<10?"0"+minute:minute}:${second<10?"0"+second:second}`;
    world.scoreboard.getObjective("side_bar").setScore("      §e时间： §c"+time,4);
    world.scoreboard.getObjective("side_bar").setScore("   §c--§b--------§c--",5);


},1)