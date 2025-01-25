import {world, system, ScreenDisplay} from "@minecraft/server";
import { log,warn,error } from "./API/logger.js";
import './newFunction.js';

log("NiaServer-Extra加载完成！");

const seaweed_potion_component = {
    onConsume(event) {
        let player = event.source;
        if (player.isInWater) {
            player.addEffect("minecraft:haste", 6000,{amplifier: 3, showParticles: false});
            player.setDynamicProperty("mcnia:seaweed_potion", 300);
            player.sendMessage("§7你感觉到一股力量在你的体内涌动...");
        } else {
            player.sendMessage("§7无事发生，尝试在水中试试？");}
    }
}

world.beforeEvents.worldInitialize.subscribe(({ itemComponentRegistry }) => {
    itemComponentRegistry.registerCustomComponent("mcnia:seaweed_potion", seaweed_potion_component);
})

system.runInterval(() => {
    for (const player of world.getPlayers()) {
        if (player.getDynamicProperty("mcnia:seaweed_potion") == undefined) continue;
        if (player.getDynamicProperty("mcnia:seaweed_potion") <= 0) continue;
        player.setDynamicProperty("mcnia:seaweed_potion", player.getDynamicProperty("mcnia:seaweed_potion") - 5);
        if (!player.isInWater && player.getEffect("minecraft:haste") != undefined) {
            player.removeEffect("minecraft:haste");
            player.setDynamicProperty("mcnia:seaweed_potion", 0);
            player.sendMessage("§7你感觉到一股力量在你的体内消散了...");
        }
    }
}, 100);
