import {world,system, ItemComponentTypes, EntityComponentTypes, EquipmentSlot} from '@minecraft/server';
import { ActionFormData,ModalFormData,MessageFormData } from '@minecraft/server-ui'
import { log } from './API/logger';

const can_cr_id = [
    "mcnia:op_sword",
    "mcnia:dark_sword",
    "mcnia:fire_sword",
    "mcnia:rock_sword",
    "mcnia:grass_sword",
    "mcnia:thunder_sword",
    "mcnia:water_sword",
    "mcnia:wind_sword"
]
const can_cr_data = {
    "mcnia:op_sword": "op之剑",
    "mcnia:dark_sword": "暗·剑",
    "mcnia:fire_sword": "火·剑",
    "mcnia:rock_sword": "岩·剑",
    "mcnia:grass_sword": "草·剑",
    "mcnia:thunder_sword": "雷·剑",
    "mcnia:water_sword": "水·剑",
    "mcnia:wind_sword": "空·剑"
}

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
})


world.afterEvents.entityHurt.subscribe((event) => {
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
                player.addEffect("minecraft:weakness",100,{"amplifier": 2,"showParticles":false});
            }

        //岩元素
        if (equ_head.typeId == "mcnia:rock_helmet" &&
            equ_chest.typeId == "mcnia:rock_chestplate" &&
            equ_legs.typeId == "mcnia:rock_leggings" &&
            equ_feet.typeId == "mcnia:rock_boots") {
                player.addEffect("minecraft:resistance",100,{"amplifier": 1,"showParticles":false});
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
        }
    }


})

const EQGUI = {
    Main(player) {
        const MainForm = new ActionFormData()
            .title("§e§l武器铺")
            .body("§c仅元素武器可以进行进阶、升级操作\n" +
                "§c§l进阶武器：§r将没有任何词条的武器进阶为可以进行升级的武器\n" +
                "§c§l升级武器：§r将已经进阶的武器进行升级，最高等级为5级\n" +
                "§c§l重置武器：§r将已经进阶的武器重置为初始状态\n" +
                "§c§l注意：§r升级与重置武器均需要消耗武器强化石，当前版本请前往商店购买\n"+
                "§c§l武器铺试运行期间 进阶武器免费！"
            )
            .button("进阶武器")
            .button("升级武器")
            .button("重置武器")
        MainForm.show(player).then((response) => {
            switch (response.selection) {
                case 0:
                    this.Init(player)
                    break;
                case 1:
                    this.Upgrade(player)
                    break;
                case 2:
                    this.Reset(player)
                    break;
            }
        })

    },

    Init(player) {
        let InventoryData = ["-无-"]
        const InitForm = new ModalFormData()
            .title("请选择要进阶的武器")
            let HaveItemIndex = []
            for (let i = 0; i < 36; i++) {
                if (player.getComponent(EntityComponentTypes.Inventory).container.getItem(i) != undefined &&
                can_cr_id.includes(player.getComponent(EntityComponentTypes.Inventory).container.getItem(i).typeId) &&
                player.getComponent(EntityComponentTypes.Inventory).container.getItem(i).getLore().length == 0) {
                    if (player.getComponent(EntityComponentTypes.Inventory).container.getItem(i).nameTag != undefined) {
                        InventoryData.push("§c槽id：" + i + " §r" + player.getComponent(EntityComponentTypes.Inventory).container.getItem(i).nameTag);
                        HaveItemIndex.push(i)
                    } else {
                        InventoryData.push("§c槽id：" + i + " §r" + can_cr_data[player.getComponent(EntityComponentTypes.Inventory).container.getItem(i).typeId]);
                        HaveItemIndex.push(i)
                    }
                }
            }
            InitForm.dropdown("请选择要进阶的武器",InventoryData)
            InitForm.show(player).then((response) => {
                if (response.canceled) {
                    this.Main(player)
                } else if (response.formValues[0] == 0) {
                    //错误
                } else {
                    let item = player.getComponent(EntityComponentTypes.Inventory).container.getItem(HaveItemIndex[response.formValues[0] - 1])
                    item.setLore(["§c+0","暴击率：§c20%","暴击伤害：§c50%"])
                    player.getComponent(EntityComponentTypes.Inventory).container.setItem(HaveItemIndex[response.formValues[0] - 1],item)
                    player.sendMessage("§7武器进阶成功！")
                }
            })
    },

    Upgrade(player) {
        let InventoryData = ["-无-"]
        const UpgradeForm = new ModalFormData()
            .title("请选择要升级的武器")
            let HaveItemIndex = []
            let sword_lev = 0;
            for (let i = 0; i < 36; i++) {
                if (player.getComponent(EntityComponentTypes.Inventory).container.getItem(i) != undefined && can_cr_id.includes(player.getComponent(EntityComponentTypes.Inventory).container.getItem(i).typeId) && player.getComponent(EntityComponentTypes.Inventory).container.getItem(i).getLore().length != 0 && Number(player.getComponent(EntityComponentTypes.Inventory).container.getItem(i).getLore()[0].slice(2)) < 5) {
                    if (player.getComponent(EntityComponentTypes.Inventory).container.getItem(i).nameTag != undefined) {
                        InventoryData.push("§c槽id：" + i + " §r" + player.getComponent(EntityComponentTypes.Inventory).container.getItem(i).nameTag)
                        HaveItemIndex.push(i)
                    } else {
                        InventoryData.push("§c槽id：" + i + " §r" + can_cr_data[player.getComponent(EntityComponentTypes.Inventory).container.getItem(i).typeId] + " §r§c等级：§r " + player.getComponent(EntityComponentTypes.Inventory).container.getItem(i).getLore()[0].slice(2))
                        HaveItemIndex.push(i)
                    }
                }
            }
            UpgradeForm.dropdown("请选择要进阶的武器",InventoryData)
            UpgradeForm.show(player).then((response) => {
                if (response.canceled) {
                    this.Main(player)
                } else if (response.formValues[0] == 0) {
                    //错误
                } else {
                    let sword_data = player.getComponent(EntityComponentTypes.Inventory).container.getItem(HaveItemIndex[response.formValues[0] - 1])
                    this.UpgradeSub(player, sword_data, Number(sword_data.getLore()[0].slice(2)), HaveItemIndex[response.formValues[0] - 1])
                    // item.getLore()[0]
                    // item.setLore(["§c+12","暴击率：§c80%","暴击伤害：§c500%"])
                    // player.getComponent(EntityComponentTypes.Inventory).container.setItem(HaveItemIndex[response.formValues[0] - 1],item)
                    // player.sendMessage("§7武器进阶成功！")
                }
            })
    },

    UpgradeSub(player, sword_data, sword_level, slot) {
        let num = 0;
        for (let i = 0; i < 36; i++) {
            //计算钻石数量
            if (player.getComponent(EntityComponentTypes.Inventory).container.getItem(i) != undefined && player.getComponent(EntityComponentTypes.Inventory).container.getItem(i).typeId == "mcnia:augmentation_stone") {
                num = num + player.getComponent(EntityComponentTypes.Inventory).container.getItem(i).amount
            }
        }
        if (num == 0) {
            this.Info(player,"突破失败！\n原因是您背包内的突破素材不够！", "突破失败","UpgradeForm");
        } else {
            if (5 - sword_level <= num) {
                num = 5 - sword_level;
            }
            const UpgradeSubForm = new ModalFormData()
            .title("突破武器" + can_cr_data[sword_data.typeId])
            .slider("请选择要进阶武器要使用的素材数量",1,num,1);
            UpgradeSubForm.show(player).then((response) => {
                if (response.canceled) return;
                //清理背包使用的突破石
                let use_num = response.formValues[0];
                world.getDimension("minecraft:overworld").runCommand(`clear @a[name="${player.nameTag}"] mcnia:augmentation_stone 0 ${use_num}`);
                let add_cr = 0;
                let add_cd = 0;
                let info = "";
                let store_random_data = 0;
                let now_level = sword_level;
                for (let i = 0; i < response.formValues[0]; i++) {
                    let random_num = Math.random();
                    let durability = sword_data.getComponent(ItemComponentTypes.Durability).maxDurability - sword_data.getComponent(ItemComponentTypes.Durability).damage;
                    switch (true) {
                        case random_num <= 0.02:
                            sword_data.getComponent(ItemComponentTypes.Durability).damage = parseInt(durability / 2);
                            info = info + "\n等级 §c§l" + now_level + "§r >>>> §c§l" + (now_level + 1) +"\n§r§c§l强化失败，耐久损失一半！\n\n§r=================\n";
                            now_level = now_level + 1;
                            break;
                        case random_num > 0.02 && random_num <= 0.2:
                            info = info + "\n等级 §c§l" + now_level + "§r >>>> §c§l" + (now_level + 1) + "\n§r§c§l强化失败，无事发生！\n\n§r=================\n";
                            now_level = now_level + 1;
                            break;
                        case random_num > 0.2 && random_num <= 0.5:
                            store_random_data = Math.random() * 9 + 1
                            add_cr = add_cr + store_random_data;
                            info = info + "\n等级 §c§l" + now_level + "§r >>>> §c§l" + (now_level + 1) + "\n§r暴击率 +§c§l" + store_random_data.toFixed(2) + "%%\n\n§r=================\n";
                            now_level = now_level + 1;
                            break;
                        case random_num > 0.5 && random_num <= 0.8:
                            store_random_data = Math.random() * 18 + 2;
                            add_cd = add_cd + store_random_data;
                            info = info + "\n等级 §c§l" + now_level + "§r >>>> §c§l" + (now_level + 1) + "\n§r暴击伤害 +§c§l" + store_random_data.toFixed(2) + "%%\n\n§r=================\n";
                            now_level = now_level + 1;
                            break;
                        case random_num > 0.8 && random_num <= 0.89:
                            store_random_data = Math.random() * 7 + 8;
                            add_cr = add_cr + store_random_data;
                            info = info + "\n等级 §c§l" + now_level + "§r >>>> §c§l" + (now_level + 1) + "\n§r暴击率 +§c§l" + store_random_data.toFixed(2) + "%%\n\n§r=================\n";
                            now_level = now_level + 1;
                            break;
                        case random_num > 0.89 && random_num <= 0.98:
                            store_random_data = Math.random() * 14 + 16;
                            add_cd = add_cd + store_random_data;
                            info = info + "\n等级 §c§l" + now_level + "§r >>>> §c§l" + (now_level + 1) + "\n§r暴击伤害 +§c§l" + store_random_data.toFixed(2) + "%%\n\n§r=================\n";
                            now_level = now_level + 1;
                            break;
                        case random_num > 0.98 && random_num <= 0.989:
                            store_random_data = Math.random() * 30 + 30;
                            add_cr = add_cr + store_random_data;
                            info = info + "\n等级 §c§l" + now_level + "§r >>>> §c§l" + (now_level + 1) + "\n§r暴击率 +§c§l" + store_random_data.toFixed(2) + "%%\n\n§r=================\n";
                            now_level = now_level + 1;
                            break;
                        case random_num > 0.989 && random_num <= 0.998:
                            store_random_data = Math.random() * 60 + 60;
                            add_cd = add_cd + store_random_data;
                            info = info + "\n等级 §c§l" + now_level + "§r >>>> §c§l" + (now_level + 1) + "\n§r暴击伤害 +§c§l" + store_random_data.toFixed(2) + "%%\n\n§r=================\n";
                            now_level = now_level + 1;
                            break;
                        case random_num > 0.998 && random_num <= 0.999:
                            add_cr = add_cr + 100;
                            info = info + "\n等级 §c§l" + now_level + "§r >>>> §c§l" + (now_level + 1) + "\n§r暴击率 +§c§l100%%\n\n§r=================\n";
                            now_level = now_level + 1;
                            break;
                        case random_num > 0.999 && random_num <= 1:
                            add_cd = add_cd + 200;
                            info = info + "\n等级 §c§l" + now_level + "§r >>>> §c§l" + (now_level + 1) + "\n§r暴击伤害 +§c§l200%%\n\n§r=================\n";
                            now_level = now_level + 1;
                            break;

                    }
                }
                this.UpgradeResult(player,info,add_cr.toFixed(2),add_cd.toFixed(2));
                let cr = (Number(sword_data.getLore()[1].split("：")[1].slice(2, -1)) + Number(add_cr)).toFixed(2);
                let cd = (Number(sword_data.getLore()[2].split("：")[1].slice(2, -1)) + Number(add_cd)).toFixed(2);
                sword_data.setLore(["§c+" + now_level,"暴击率：§c"+ cr +"%","暴击伤害：§c" + cd + "%"]);
                player.getComponent(EntityComponentTypes.Inventory).container.setItem(slot,sword_data);

            })
        }

    },

    UpgradeResult(player,info,add_cr,add_cd) {
        const UpgradeResultForm = new ActionFormData()
            .body("本次升级总成长值：\n\n暴击率总提升：§c§l" + add_cr +"%%§r\n\n暴击伤害总提升：§c§l" + add_cd + "%%\n\n§r=================\n" + info)
            .title("武器升级结果")
            .button("确认强化结果")
            .show(player)
    },

    //重置武器
    Reset(player) {
        let InventoryData = ["-无-"]
        const ResetForm = new ModalFormData()
            .title("请选择要重置的武器")
            let HaveItemIndex = []
            let sword_lev = 0;
            for (let i = 0; i < 36; i++) {
                if (player.getComponent(EntityComponentTypes.Inventory).container.getItem(i) != undefined && can_cr_id.includes(player.getComponent(EntityComponentTypes.Inventory).container.getItem(i).typeId) && player.getComponent(EntityComponentTypes.Inventory).container.getItem(i).getLore().length != 0 && Number(player.getComponent(EntityComponentTypes.Inventory).container.getItem(i).getLore()[0].slice(2)) != 0) {
                    if (player.getComponent(EntityComponentTypes.Inventory).container.getItem(i).nameTag != undefined) {
                        InventoryData.push("§c槽id：" + i + " §r" + player.getComponent(EntityComponentTypes.Inventory).container.getItem(i).nameTag)
                        HaveItemIndex.push(i)
                    } else {
                        InventoryData.push("§c槽id：" + i + " §r" + can_cr_data[player.getComponent(EntityComponentTypes.Inventory).container.getItem(i).typeId] + " §r§c等级：§r " + player.getComponent(EntityComponentTypes.Inventory).container.getItem(i).getLore()[0].slice(2))
                        HaveItemIndex.push(i)
                    }
                }
            }
            ResetForm.dropdown("请选择要重置的武器",InventoryData)
            ResetForm.show(player).then((response) => {
                if (response.canceled) {
                    this.Main(player)
                } else if (response.formValues[0] == 0) {
                    //错误
                } else {
                    let num = 0;
                    for (let i = 0; i < 36; i++) {
                        if (player.getComponent(EntityComponentTypes.Inventory).container.getItem(i) != undefined && player.getComponent(EntityComponentTypes.Inventory).container.getItem(i).typeId == "mcnia:augmentation_stone") {
                            num = num + player.getComponent(EntityComponentTypes.Inventory).container.getItem(i).amount
                        }
                    }
                    if (num == 0) {
                        player.sendMessage("§c重置失败！原因是您背包内的武器强化石不够！");
                        return;
                    }
                    world.getDimension("minecraft:overworld").runCommand(`clear @a[name="${player.nameTag}"] mcnia:augmentation_stone 0 1`);
                    let item = player.getComponent(EntityComponentTypes.Inventory).container.getItem(HaveItemIndex[response.formValues[0] - 1])
                    item.setLore(["§c+0","暴击率：§c20%","暴击伤害：§c50%"])
                    player.getComponent(EntityComponentTypes.Inventory).container.setItem(HaveItemIndex[response.formValues[0] - 1],item)
                    player.sendMessage("§7武器重置成功！")
                    // item.getLore()[0]
                    // item.setLore(["§c+12","暴击率：§c80%","暴击伤害：§c500%"])
                    // player.getComponent(EntityComponentTypes.Inventory).container.setItem(HaveItemIndex[response.formValues[0] - 1],item)
                    // player.sendMessage("§7武器进阶成功！")
                }
            })
    },

    AdminChange(player) {
        const AdminChangeForm = new ModalFormData()
            .title("武器强化开发者工具")
            let InventoryData = ["-无-"]
            let HaveItemIndex = []
            for (let i = 0; i < 36; i++) {
                if (player.getComponent(EntityComponentTypes.Inventory).container.getItem(i) != undefined && can_cr_id.includes(player.getComponent(EntityComponentTypes.Inventory).container.getItem(i).typeId) && player.getComponent(EntityComponentTypes.Inventory).container.getItem(i).getLore().length != 0) {
                    if (player.getComponent(EntityComponentTypes.Inventory).container.getItem(i).nameTag != undefined) {
                        InventoryData.push("§c槽id：" + i + " §r" + player.getComponent(EntityComponentTypes.Inventory).container.getItem(i).nameTag)
                        HaveItemIndex.push(i)
                    } else {
                        InventoryData.push("§c槽id：" + i + " §r" + can_cr_data[player.getComponent(EntityComponentTypes.Inventory).container.getItem(i).typeId] + " §r§c等级：§r " + player.getComponent(EntityComponentTypes.Inventory).container.getItem(i).getLore()[0].slice(2))
                        HaveItemIndex.push(i)
                    }
                }
            }
            AdminChangeForm.dropdown("请选择要修改的武器",InventoryData)
            AdminChangeForm.show(player).then((response) => {
                if (response.canceled) {
                    this.Main(player)
                } else if (response.formValues[0] == 0) {
                    player.sendMessage("§c请选择要修改的武器...")
                    system.runTimeout(() => {this.AdminChange(player)},1000)
                } else {
                    
                }
            })
    },

    AdminChangeSub(player, sword_data, sword_level, slot) {
        const AdminChangeSubForm = new ModalFormData()
            .title("武器强化开发者工具")
            .textField
    },

    Info(player,info,title,Form) {
        const InfoForm = new MessageFormData()
            .title(title)
            .body(info)
            .button1("确认")
            .button2("退出")
            .show(player).then((response) => {
                if (response.selection == 0) {
                    switch (Form) {
                        case "UpgradeForm":
                            this.Upgrade(player)
                            break;
                    }
                }
            })
    },
}

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


// 2%概率强化大失败 - 耐久损失一半
// 18%概率强化失败 - 无事发生
// 30%概率提高暴击率1%-10%任意数值
// 30%概率提高暴击伤害2%-20%任意数值
// 9%概率提高暴击率8%-15%任意数值
// 9%概率提高暴击伤害16%-30%任意数值
// 0.8%提高暴击率 30%-60%任意数值
// 0.8%提高暴击伤害 60%-120%任意数值
// 0.2%提高暴击率 80%
// 0.2%提高暴击伤害 200%

//对于物品使用的检测
// world.afterEvents.itemUse.subscribe(event => {
//     if (event.itemStack.typeId == "minecraft:stick") {
//         let player = event.source;

//         EQGUI.Main(player)

//     }
// })

