import { world } from "@minecraft/server";
import { ActionFormData,ModalFormData,MessageFormData } from '@minecraft/server-ui';


const task_data = {
    "ZHCN0100000": {
        "name": "第一章",
        "description": "第一章内容",
        "next": "ZHCN0100100",
        "data": {
            "ZHCN0100100":{
                "mode": "text",
                "name": "第一章 第一节",
                "description": "第一章 第一节内容",
                "reward": [
                    {
                        "type": "item",
                        "item": "minecraft:iron_sword",
                        "count": 1,
                        "name": "铁剑"
                    },
                    {
                        "type": "command",
                        "command": "give @s minecraft:iron_sword 1",
                    }
                ],
                "button": "下一节",
                "next": "ZHCN0100200"
            },
            "ZHCN0100200":{
                "mode": "check",
                "name": "第一章 第二节",
                "description": "第一章 第二节内容",
                "checkmode": "and",
                "check":[
                    {
                        "type": "item",
                        "item": "minecraft:iron_sword",
                        "count": 1
                    },
                    {
                        "type": "xp",
                        "level": 1
                    },
                    {
                        "type": "scoreboard",
                        "name": "money",
                        "value": 100
                    }
                ],
                "reward": [
                    {
                        "type": "item",
                        "item": "minecraft:iron_pickaxe",
                        "count": 1,
                        "name": "铁镐"
                    },
                    {
                        "type": "command",
                        "command": "give @s minecraft:iron_pickaxe 1",
                    }
                ],
                "button": "下一节",
                "next": "ZHCN0100300"
            }
        }
    }
}



function task_main(player, task_id) {
    //首先检查task_id是否为章节id格式
}






world.afterEvents.itemUse.subscribe(event => {
    if (event.itemStack.typeId == "minecraft:stick") {
        let player = event.source;

    }
})



