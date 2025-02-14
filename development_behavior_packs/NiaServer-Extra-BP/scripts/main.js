import {world, system, ScreenDisplay, ItemComponentTypes,  EntityComponentTypes, EffectType, EffectTypes} from "@minecraft/server";
import { log,warn,error } from "./API/logger.js";
import './newFunction.js';

log("NiaServer-Extra加载完成！");

const seaweed_potion_component = {
    onConsume(event) {
        let player = event.source;
        if (player.isInWater) {
            player.addEffect("minecraft:haste", 6000,{amplifier: 3, showParticles: false});
            player.addEffect("minecraft:night_vision", 6000,{amplifier: 0, showParticles: false});
            player.setDynamicProperty("sea_potion_time", 300);
            player.sendMessage("§7你感觉到一股力量在你的体内涌动...");
        } else {
            player.sendMessage("§7无事发生，尝试在水中试试？");
        }
    }
}

const kelp_potion_small_component = {
    onConsume(event) {
        let player = event.source;
        if (player.isInWater) {
            player.addEffect("minecraft:haste", 6000,{amplifier: 3, showParticles: false});
            player.addEffect("minecraft:night_vision", 6000,{amplifier: 0, showParticles: false});
            player.setDynamicProperty("sea_potion_time", 300);
            player.sendMessage("§7你感觉到一股力量在你的体内涌动...");
        } else {
            player.sendMessage("§7无事发生，尝试在水中试试？");
        }
    }
}

const kelp_potion_big_component = {
    onConsume(event) {
        let player = event.source;
        if (player.isInWater) {
            player.addEffect("minecraft:haste", 12000,{amplifier: 3, showParticles: false});
            player.addEffect("minecraft:night_vision", 12000,{amplifier: 0, showParticles: false});
            player.setDynamicProperty("sea_potion_time", 600);
            player.sendMessage("§7你感觉到一股力量在你的体内涌动...");
        } else {
            player.sendMessage("§7无事发生，尝试在水中试试？");
        }
    }
}

const item_collector_small_component = {
    onUse(event) {
        event.source.sendMessage("§7物品收集器已开启...");
        // event.itemStack.getComponent(ItemComponentTypes.Durability).damage = event.itemStack.getComponent(ItemComponentTypes.Durability).damage + 1;
        // event.source.sendMessage(event.itemStack.getComponent(ItemComponentTypes.Durability).damage);
        const item_collector_task_id = system.runInterval(() => {
            let entity_list = event.source.getEntitiesFromViewDirection({"type": "item"});
            if (entity_list.length == 0) {
                return;
            }
            for (let i = 0; i < entity_list.length; i++) {
                if (entity_list[i].distanse > 10) {
                    continue;
                }
                entity_list[i].entity.teleport(event.source.location);
            }
        },1);
        system.runTimeout(() => {
            system.clearRun(item_collector_task_id);
            event.source.sendMessage("§7物品收集器已关闭...");
        }, 100);
    }
}

const item_collector_middle_component = {
    onUse(event) {
        event.source.sendMessage("§7物品收集器已开启...");
        const item_collector_task_id = system.runInterval(() => {
            let entity_list = event.source.getEntitiesFromViewDirection({"type": "item"});
            if (entity_list.length == 0) {
                return;
            }
            for (let i = 0; i < entity_list.length; i++) {
                if (entity_list[i].distanse > 20) {
                    continue;
                }
                entity_list[i].entity.teleport(event.source.location);
            }
        },1);
        system.runTimeout(() => {
            system.clearRun(item_collector_task_id);
            event.source.sendMessage("§7物品收集器已关闭...");
        }, 200);
    }
}

const item_collector_big_component = {
    onUse(event) {
        event.source.sendMessage("§7物品收集器已开启...");
        const item_collector_task_id = system.runInterval(() => {
            let entity_list = event.source.getEntitiesFromViewDirection({"type": "item"});
            if (entity_list.length == 0) {
                return;
            }
            for (let i = 0; i < entity_list.length; i++) {
                if (entity_list[i].distanse > 20) {
                    continue;
                }
                entity_list[i].entity.teleport(event.source.location);
            }
        },1);
        system.runTimeout(() => {
            system.clearRun(item_collector_task_id);
            event.source.sendMessage("§7物品收集器已关闭...");
        }, 300);
    }
}

// const dark_sword_component = {
//     onHitEntity(event) {
//         let player_health = event.hitEntity.getComponent(EntityComponentTypes.Health);
//         player_health.setCurrentValue(player_health.currentValue - 20);
//     }
// }

const pink_lollipop_component = {
    onConsume(event) {
        let player = event.source;
        player.addEffect("minecraft:regeneration", 100,{amplifier: 1, showParticles: false});
    }
}

const tootsie_roll_component = {
    onConsume(event) {
        let player = event.source;
        player.addEffect("minecraft:regeneration", 100,{amplifier: 1, showParticles: false});
    }
}



world.beforeEvents.worldInitialize.subscribe(({ itemComponentRegistry }) => {
    itemComponentRegistry.registerCustomComponent("mcnia:seaweed_potion", seaweed_potion_component);
    itemComponentRegistry.registerCustomComponent("mcnia:kelp_potion_small", kelp_potion_small_component);
    itemComponentRegistry.registerCustomComponent("mcnia:kelp_potion_big", kelp_potion_big_component);
    itemComponentRegistry.registerCustomComponent("mcnia:item_collector_small", item_collector_small_component);
    itemComponentRegistry.registerCustomComponent("mcnia:item_collector_middle", item_collector_middle_component);
    itemComponentRegistry.registerCustomComponent("mcnia:item_collector_big", item_collector_big_component);
    itemComponentRegistry.registerCustomComponent("mcnia:pink_lollipop", pink_lollipop_component);
    itemComponentRegistry.registerCustomComponent("mcnia:tootsie_roll", tootsie_roll_component);
    //itemComponentRegistry.registerCustomComponent("mcnia:dark_sword", dark_sword_component);
})

system.runInterval(() => {
    for (const player of world.getPlayers()) {
        if (player.getComponent(EntityComponentTypes.Equippable).getEquipment("Head")) {
            let equ_head = player.getComponent(EntityComponentTypes.Equippable).getEquipment("Head");
            if (equ_head.typeId == "mcnia:oxygen_helmet" && !player.isInWater) {
                player.addEffect("minecraft:water_breathing",320,{amplifier: 0, showParticles: false});
            }
        }
        if (player.getDynamicProperty("sea_potion_time") == undefined) continue;
        if (player.getDynamicProperty("sea_potion_time") <= 0) continue;
        player.setDynamicProperty("sea_potion_time", player.getDynamicProperty("sea_potion_time") - 5);
        if (!player.isInWater && player.getEffect("minecraft:haste") != undefined && player.getEffect("minecraft:night_vision") != undefined) {
            player.removeEffect("minecraft:haste");
            player.removeEffect("minecraft:night_vision");
            player.setDynamicProperty("sea_potion_time", 0);
            player.sendMessage("§7你感觉到一股力量在你的体内消散了...");
        }
    }
}, 100);
