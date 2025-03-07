import { ActionFormData, ModalFormData, MessageFormData } from "@minecraft/server-ui";
import { system, world, EntityComponentTypes, ItemComponentTypes } from "@minecraft/server";
import { can_cr_data,can_cr_id } from "./meta_data";

// const can_cr_id = can_cr_id
export const EQGUI = {
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
            .textField()
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
//     if (event.itemStack.typeId == "minecraft:stick" && event.itemStack.nameTag == "武器铺") {
//         let player = event.source;
//         EQGUI.Main(player)
//     }
// })

