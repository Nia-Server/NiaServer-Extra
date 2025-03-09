import {world,system, ItemComponentTypes, EntityComponentTypes, EquipmentSlot} from '@minecraft/server';
import { can_cr_id } from "./meta_data";


world.afterEvents.entityHurt.subscribe((event) => {
    //判断是不是玩家使用攻击
    if (event.damageSource.cause == "entityAttack" && event.damageSource.damagingEntity.typeId == "minecraft:player") {
        //判断玩家拿的武器
        let selectedItem = event.damageSource.damagingEntity.getComponent(EntityComponentTypes.Inventory).container.getItem(event.damageSource.damagingEntity.selectedSlotIndex);
        if (selectedItem == undefined) {
            if (event.hurtEntity.getComponent(EntityComponentTypes.Health).currentValue.toFixed(2) <= 0) {
                if (event.hurtEntity.nameTag != "") {
                    event.damageSource.damagingEntity.sendMessage("§7你对 §r" + event.hurtEntity.nameTag + " §7造成了 §e§l" + event.damage.toFixed(2) + " §r§7伤害,对目标生物造成致命一击！");
                } else {
                    let target_entity = "entity." + event.hurtEntity.typeId.split(":")[1] + ".name"
                    let rawText = [{"text": "§7你对 §r"},{"translate": target_entity},{"text": " §7造成了 §e§l" + event.damage.toFixed(2) + " §r§7伤害,对目标生物造成致命一击！"}]
                    event.damageSource.damagingEntity.sendMessage(rawText);
                }
            } else {
                if (event.hurtEntity.nameTag != "") {
                    event.damageSource.damagingEntity.sendMessage("§7你对 §r" + event.hurtEntity.nameTag + " §7造成了 §e§l" + event.damage.toFixed(2) + " §r§7伤害,目标当前血量剩余：§e§l " + event.hurtEntity.getComponent(EntityComponentTypes.Health).currentValue.toFixed(2));
                } else {
                    let target_entity = "entity." + event.hurtEntity.typeId.split(":")[1] + ".name"
                    let rawText = [{"text": "§7你对 §r"},{"translate": target_entity},{"text": " §7造成了 §e§l" + event.damage.toFixed(2) + " §r§7伤害,目标当前血量剩余：§e§l " + event.hurtEntity.getComponent(EntityComponentTypes.Health).currentValue.toFixed(2)}]
                    event.damageSource.damagingEntity.sendMessage(rawText);
                }
            }
            return;
        }
        //判断武器，看有没有特殊效果
        if (selectedItem.typeId) {
            let all_damage = event.damage;
            let before_damage_health = event.hurtEntity.getComponent(EntityComponentTypes.Health).currentValue + event.damage;
            switch (selectedItem.typeId) {
                case "mcnia:dark_sword":
                    all_damage = all_damage + 2;
                    event.damageSource.damagingEntity.addEffect("minecraft:blindness",40,{"amplifier": 0,"showParticles":false});
                    break;
                case "mcnia:fire_sword":
                    const fire_sword_task_id = system.runInterval(() => {
                        try {event.hurtEntity.setOnFire(5,false);} catch (e) {}
                    },1)
                    system.runTimeout(() => {
                        system.clearRun(fire_sword_task_id);
                    }, 100);
                    break;
                case "mcnia:wind_sword":
                    event.hurtEntity.addEffect("minecraft:levitation",40,{"amplifier": 2,"showParticles":false});
                    event.damageSource.damagingEntity.addEffect("minecraft:speed",400,{"amplifier": 3, "showParticles":false});
                    break;
                case "mcnia:rock_sword":
                    let equ = event.hurtEntity.getComponent(EntityComponentTypes.Equippable);
                    if (event.hurtEntity.typeId != "minecraft:player") return;
                    if (equ.getEquipment("Chest")) {
                        let equ_chest = equ.getEquipment("Chest");
                        if (equ_chest.getComponent(ItemComponentTypes.Durability).maxDurability >= equ_chest.getComponent(ItemComponentTypes.Durability).damage + 30) {
                            equ_chest.getComponent(ItemComponentTypes.Durability).damage = equ_chest.getComponent(ItemComponentTypes.Durability).damage + 10;
                            equ.setEquipment("Chest", equ_chest);
                        }
                    }
                    if (equ.getEquipment("Feet")) {
                        let equ_feet = equ.getEquipment("Feet");
                        if (equ_feet.getComponent(ItemComponentTypes.Durability).maxDurability >= equ_feet.getComponent(ItemComponentTypes.Durability).damage + 30) {
                            equ_feet.getComponent(ItemComponentTypes.Durability).damage = equ_feet.getComponent(ItemComponentTypes.Durability).damage + 10;
                            equ.setEquipment("Feet", equ_feet);
                        }
                    }
                    if (equ.getEquipment("Head")) {
                        let equ_head = equ.getEquipment("Head");
                        if (equ_head.getComponent(ItemComponentTypes.Durability).maxDurability >= equ_head.getComponent(ItemComponentTypes.Durability).damage + 30) {
                            equ_head.getComponent(ItemComponentTypes.Durability).damage = equ_head.getComponent(ItemComponentTypes.Durability).damage + 10;
                            equ.setEquipment("Head", equ_head);
                        }
                    }
                    if (equ.getEquipment("Legs")) {
                        let equ_legs = equ.getEquipment("Legs");
                        if (equ_legs.getComponent(ItemComponentTypes.Durability).maxDurability >= equ_legs.getComponent(ItemComponentTypes.Durability).damage + 30) {
                            equ_legs.getComponent(ItemComponentTypes.Durability).damage = equ_legs.getComponent(ItemComponentTypes.Durability).damage + 10;
                            equ.setEquipment("Legs", equ_legs);
                        }
                    }
                    break;
                case "mcnia:grass_sword":
                    event.hurtEntity.addEffect("minecraft:wither",100,{"amplifier": 1,"showParticles":false});
                    event.hurtEntity.addEffect("minecraft:slowness",100,{"amplifier": 2,"showParticles":false});
                    break;
                case "mcnia:thunder_sword":
                    event.damageSource.damagingEntity.addEffect("minecraft:fire_resistance",40,{"amplifier": 2,"showParticles":false});
                    event.damageSource.damagingEntity.addEffect("minecraft:absorption",20,{"amplifier": 1,"showParticles":false});
                    event.hurtEntity.addEffect("minecraft:slowness",60,{"amplifier": 1,"showParticles":false});
                    event.hurtEntity.runCommand(`summon minecraft:lightning_bolt ${event.hurtEntity.location.x} ${event.hurtEntity.location.y} ${event.hurtEntity.location.z}`);
                    event.hurtEntity.runCommand(`summon minecraft:lightning_bolt ${event.hurtEntity.location.x} ${event.hurtEntity.location.y} ${event.hurtEntity.location.z}`);
                    event.hurtEntity.runCommand(`summon minecraft:lightning_bolt ${event.hurtEntity.location.x} ${event.hurtEntity.location.y} ${event.hurtEntity.location.z}`);
                    break;
                case "mcnia:water_sword":
                    event.damageSource.damagingEntity.getComponent(EntityComponentTypes.Health).setCurrentValue(event.damageSource.damagingEntity.getComponent(EntityComponentTypes.Health).currentValue + 2);
                    event.hurtEntity.addEffect("minecraft:poison",100,{"amplifier": 0,"showParticles":false});
                    break;
            }

            if (can_cr_id.includes(selectedItem.typeId) && selectedItem.getLore().length != 0 && selectedItem.getLore()[0].slice(0,3) == "§c+") {
                //开始计算暴击率
                let cr = Number(selectedItem.getLore()[1].split("：")[1].slice(2, -1));
                let cd = Number(selectedItem.getLore()[2].split("：")[1].slice(2, -1));
                let random = Math.random() * 100;
                //event.damageSource.damagingEntity.sendMessage("hh"+ cr + " " + cd + " " + random)
                if (random <= cr) {
                    //暴击了
                    //首先先减血
                    all_damage = all_damage * (1 + cd * 0.01);
                    //结算血量
                    event.hurtEntity.getComponent(EntityComponentTypes.Health).setCurrentValue(before_damage_health - all_damage);
                    //判断怪物血量是否小于0
                    if (event.hurtEntity.getComponent(EntityComponentTypes.Health).currentValue.toFixed(2) <= 0) {
                        //判断怪物有没有名称标签
                        if (event.hurtEntity.nameTag != "") {
                            event.damageSource.damagingEntity.sendMessage("§7你对 §r" + event.hurtEntity.nameTag + " §7造成了 §c§l" + all_damage.toFixed(2) + " §r§7暴击伤害,对目标生物造成致命一击！");
                            event.hurtEntity.runCommand("particle mcnia:crit ~ ~1 ~");
                            event.hurtEntity.runCommand("particle minecraft:critical_hit_emitter ~ ~1 ~");
                        } else {
                            let target_entity = "entity." + event.hurtEntity.typeId.split(":")[1] + ".name"
                            let rawText = [{"text": "§7你对 §r"},{"translate": target_entity},{"text": " §7造成了 §c§l" + all_damage.toFixed(2) + " §r§7暴击伤害,对目标生物造成致命一击！"}]
                            event.damageSource.damagingEntity.sendMessage(rawText);
                            event.hurtEntity.runCommand("particle mcnia:crit ~ ~1 ~");
                            event.hurtEntity.runCommand("particle minecraft:critical_hit_emitter ~ ~1 ~");
                        }
                    } else {
                        if (event.hurtEntity.nameTag != "") {
                            event.damageSource.damagingEntity.sendMessage("§7你对 §r" + event.hurtEntity.nameTag + " §7造成了 §c§l" + all_damage.toFixed(2) + " §r§7暴击伤害,目标当前血量剩余：§c§l " + event.hurtEntity.getComponent(EntityComponentTypes.Health).currentValue.toFixed(2));
                            event.hurtEntity.runCommand("particle mcnia:crit ~ ~1 ~");
                            event.hurtEntity.runCommand("particle minecraft:critical_hit_emitter ~ ~1 ~");
                        } else {
                            let target_entity = "entity." + event.hurtEntity.typeId.split(":")[1] + ".name"
                            let rawText = [{"text": "§7你对 §r"},{"translate": target_entity},{"text": " §7造成了 §c§l" + all_damage.toFixed(2) + " §r§7暴击伤害,目标当前血量剩余：§c§l " + event.hurtEntity.getComponent(EntityComponentTypes.Health).currentValue.toFixed(2)}]
                            event.damageSource.damagingEntity.sendMessage(rawText);
                            event.hurtEntity.runCommand("particle mcnia:crit ~ ~1 ~");
                            event.hurtEntity.runCommand("particle minecraft:critical_hit_emitter ~ ~1 ~");
                        }
                    }
                    return;
                }
            }
            //最后设置血量结算
            event.hurtEntity.getComponent(EntityComponentTypes.Health).setCurrentValue(before_damage_health - all_damage);
            if (event.hurtEntity.getComponent(EntityComponentTypes.Health).currentValue.toFixed(2) <= 0) {
                if (event.hurtEntity.nameTag != "") {
                    event.damageSource.damagingEntity.sendMessage("§7你对 §r" + event.hurtEntity.nameTag + " §7造成了 §e§l" + all_damage.toFixed(2) + " §r§7伤害,对目标生物造成致命一击！");
                } else {
                    let target_entity = "entity." + event.hurtEntity.typeId.split(":")[1] + ".name"
                    let rawText = [{"text": "§7你对 §r"},{"translate": target_entity},{"text": " §7造成了 §e§l" + all_damage.toFixed(2) + " §r§7伤害,对目标生物造成致命一击！"}]
                    event.damageSource.damagingEntity.sendMessage(rawText);
                }
            } else {
                if (event.hurtEntity.nameTag != "") {
                    event.damageSource.damagingEntity.sendMessage("§7你对 §r" + event.hurtEntity.nameTag + " §7造成了 §e§l" + all_damage.toFixed(2) + " §r§7伤害,目标当前血量剩余：§e§l " + event.hurtEntity.getComponent(EntityComponentTypes.Health).currentValue.toFixed(2));
                } else {
                    let target_entity = "entity." + event.hurtEntity.typeId.split(":")[1] + ".name"
                    let rawText = [{"text": "§7你对 §r"},{"translate": target_entity},{"text": " §7造成了 §e§l" + all_damage.toFixed(2) + " §r§7伤害,目标当前血量剩余：§e§l " + event.hurtEntity.getComponent(EntityComponentTypes.Health).currentValue.toFixed(2)}]
                    event.damageSource.damagingEntity.sendMessage(rawText);
                }
            }

        }

        //判断对方装甲
        let player = event.damageSource.damagingEntity;
        if (player.getComponent(EntityComponentTypes.Equippable).getEquipment(EquipmentSlot.Head) &&
            player.getComponent(EntityComponentTypes.Equippable).getEquipment(EquipmentSlot.Chest) &&
            player.getComponent(EntityComponentTypes.Equippable).getEquipment(EquipmentSlot.Legs) &&
            player.getComponent(EntityComponentTypes.Equippable).getEquipment(EquipmentSlot.Feet)) {
            let equ_head = player.getComponent(EntityComponentTypes.Equippable).getEquipment(EquipmentSlot.Head);
            let equ_chest = player.getComponent(EntityComponentTypes.Equippable).getEquipment(EquipmentSlot.Chest);
            let equ_legs = player.getComponent(EntityComponentTypes.Equippable).getEquipment(EquipmentSlot.Legs);
            let equ_feet = player.getComponent(EntityComponentTypes.Equippable).getEquipment(EquipmentSlot.Feet);

            //火元素
            if (equ_head.typeId == "mcnia:fire_helmet" &&
                equ_chest.typeId == "mcnia:fire_chestplate" &&
                equ_legs.typeId == "mcnia:fire_leggings" &&
                equ_feet.typeId == "mcnia:fire_boots") {
                player.addEffect("minecraft:strength",200,{"amplifier": 4,"showParticles":false});
            }

            //雷元素
            if (equ_head.typeId == "mcnia:thunder_helmet" &&
                equ_chest.typeId == "mcnia:thunder_chestplate" &&
                equ_legs.typeId == "mcnia:thunder_leggings" &&
                equ_feet.typeId == "mcnia:thunder_boots") {
                player.addEffect("minecraft:speed",200,{"amplifier": 0,"showParticles":false});
            }
        }

    }

    //判断是不是玩家被攻击
    if (event.hurtEntity.typeId != "minecraft:player") return;
    let player = event.hurtEntity;
    if (player.getComponent(EntityComponentTypes.Equippable).getEquipment(EquipmentSlot.Head) &&
        player.getComponent(EntityComponentTypes.Equippable).getEquipment(EquipmentSlot.Chest) &&
        player.getComponent(EntityComponentTypes.Equippable).getEquipment(EquipmentSlot.Legs) &&
        player.getComponent(EntityComponentTypes.Equippable).getEquipment(EquipmentSlot.Feet)) {
        let equ_head = player.getComponent(EntityComponentTypes.Equippable).getEquipment(EquipmentSlot.Head);
        let equ_chest = player.getComponent(EntityComponentTypes.Equippable).getEquipment(EquipmentSlot.Chest);
        let equ_legs = player.getComponent(EntityComponentTypes.Equippable).getEquipment(EquipmentSlot.Legs);
        let equ_feet = player.getComponent(EntityComponentTypes.Equippable).getEquipment(EquipmentSlot.Feet);
        //草元素
        if (equ_head.typeId == "mcnia:grass_helmet" &&
            equ_chest.typeId == "mcnia:grass_chestplate" &&
            equ_legs.typeId == "mcnia:grass_leggings" &&
            equ_feet.typeId == "mcnia:grass_boots") {
                player.addEffect("minecraft:regeneration",100,{"amplifier": 2,"showParticles":false});
                player.addEffect("minecraft:weakness",100,{"amplifier": 0,"showParticles":false});
            }

        //岩元素
        if (equ_head.typeId == "mcnia:rock_helmet" &&
            equ_chest.typeId == "mcnia:rock_chestplate" &&
            equ_legs.typeId == "mcnia:rock_leggings" &&
            equ_feet.typeId == "mcnia:rock_boots") {
                player.addEffect("minecraft:resistance",100,{"amplifier": 1,"showParticles":false});
                player.addEffect("minecraft:weakness",100,{"amplifier": 1,"showParticles":false});
        }

        //风元素
        if (equ_head.typeId == "mcnia:wind_helmet" &&
            equ_chest.typeId == "mcnia:wind_chestplate" &&
            equ_legs.typeId == "mcnia:wind_leggings" &&
            equ_feet.typeId == "mcnia:wind_boots") {
                player.addEffect("minecraft:speed",200,{"amplifier": 2,"showParticles":false});
                player.addEffect("minecraft:regeneration",100,{"amplifier": 0,"showParticles":false});
        }

        //暗元素
        if (equ_head.typeId == "mcnia:dark_helmet" &&
            equ_chest.typeId == "mcnia:dark_chestplate" &&
            equ_legs.typeId == "mcnia:dark_leggings" &&
            equ_feet.typeId == "mcnia:dark_boots") {
                player.addEffect("minecraft:invisibility",200,{"amplifier": 0,"showParticles":false});
                player.addEffect("minecraft:speed",200,{"amplifier": 0,"showParticles":false});
                player.addEffect("minecraft:strength",100,{"amplifier": 0,"showParticles":false});
                world.getDimension(player.dimension.id).spawnParticle("minecraft:portal",player.location);
        }
    }

})



// system.runInterval(() => {
//     for (let player of world.getAllPlayers()) {
//         let view_entity = world.getDimension(player.dimension.id).getEntitiesFromRay(player.getHeadLocation(),player.getViewDirection());
//         if (view_entity.length != 0) {
//             for (let i = 0; i < view_entity.length; i++) {
//                 if (view_entity[i].entity.nameTag != player.nameTag) {
//                     player.sendMessage("§e[" + i + "] §cdistance: §e" + view_entity[i].distance.toFixed(2) + " §ctypeid: §e" + view_entity[i].entity.typeId);
//                     if (view_entity[i].entity.typeId == "minecraft:item") {
//                         view_entity[i].entity.teleport(player.location);
//                     }
//                 }
//             }
//         }
//     }

// },1)

// system.runInterval(() => {
//     for (let player of world.getAllPlayers()) {
//         //以玩家坐标为中心，遍历边长为20的正方形
//         for (let x = player.location.x - 8; x < player.location.x + 8; x++) {
//             for (let y = player.location.y - 4; y < player.location.y + 2; y++) {
//                 for (let z = player.location.z - 8; z < player.location.z + 8; z++) {
//                     let target_block = world.getDimension(player.dimension.id).getBlock({"x":x,"y":y,"z":z});
//                     if (target_block.typeId == "minecraft:diamond_block") {
//                         //获取玩家当前坐标到钻石坐标的距离
//                         let distance = Math.sqrt(Math.pow(player.location.x - x,2) + Math.pow(player.location.y - y,2) + Math.pow(player.location.z - z,2));
//                         //计算两坐标之间的单位向量
//                         let unit_vector = {"x":(x - player.location.x) / distance,"y":(y - player.location.y) / distance,"z":(z - player.location.z) / distance}
//                         //根据单位向量开始在两坐标的直线上生成粒子
//                         for (let i = 0; i < distance; i = i + 0.5) {
//                             world.getDimension(player.dimension.id).spawnParticle("minecraft:balloon_gas_particle",{"x":player.location.x + unit_vector.x * i,"y":player.location.y + unit_vector.y * i,"z":player.location.z + unit_vector.z * i})
//                         }
//                     }
//                 }
//             }
//         }


//     }
// },20)


