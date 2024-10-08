import {world, system, ScreenDisplay} from "@minecraft/server";
import './task.js';

world.afterEvents.playerSpawn.subscribe((event) => {
    if (event.initialSpawn) {
        system.runTimeout(() => {
            event.player.sendMessage("欢迎来到水世界！");
        },100);
    }
});