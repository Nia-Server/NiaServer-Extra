import {world, system, ScreenDisplay} from "@minecraft/server";
import { log,warn,error } from "./API/logger.js";
import './newFunction.js';

world.afterEvents.playerSpawn.subscribe((event) => {
    if (event.initialSpawn) {
        system.runTimeout(() => {
            event.player.sendMessage("欢迎来到水世界！");
        },100);
    }
});

log("NiaServer-Extra加载完成！");

//调试代码
// system.runInterval(() => {
//     for (const player of world.getAllPlayers()) {
//         // player.sendMessage("这是一个定时任务");
//         //player.runCommand('/fill ~8 ~8 ~8 ~-8 ~-8 ~-8 air replace mcnia:dark_raw_ore')
//         player.runCommand('fill ~8 ~8 ~8 ~-8 ~-8 ~-8 air replace stone')
//         player.runCommand('fill ~8 ~8 ~8 ~-8 ~-8 ~-8 air replace water')
//     }
// }, 10);