import { world } from "@minecraft/server";
import { ActionFormData,ModalFormData,MessageFormData } from '@minecraft/server-ui'
import { log } from "./API/logger.js";


const recipes = {
    "mcnia:dark_crystal": {
        "result": "mcnia:dark_crystal",
        "recipe": {
            "pattern": [
                "AAA",
                "ABA",
                "AAA"
            ],
            "key": {
                "A": {
                    "type": "mcnia:dark_ore",
                    "texture": "textures/items/ore/dark_ore"
                },
                "B": {
                    "type": "minecraft:stick",
                    "texture": "textures/items/stick"
                }
            }
        }
    }
}


export const PlayGuideGUI = {
    MainRecipe(player) {
        const MainRecipeForm = new ActionFormData()
        .title("主要")
        .button("配方1")
        .button("配方2")
        .button("配方3")
        .button("配方4")
        .show(player)
    },

    SingleRecipe(player, recipe) {
        const RecipeForm = new ActionFormData()
        .title("合成表")
        .button("暗元素宝石", "textures/items/ore/dark_ore")
        .button("")
        .button("3", "textures/items/ore/dark_ore")
        .button("4", "textures/items/ore/dark_ore")
        .button("5", "textures/items/ore/dark_ore")
        .button("6", "textures/items/ore/dark_ore")
        .button("7", "textures/items/ore/dark_ore")
        .button("8", "textures/items/ore/dark_ore")
        .button("9", "textures/items/ore/dark_ore")
        .button("10", "textures/items/ore/dark_ore")
        .button("11", "textures/items/ore/dark_ore")
        .button("12", "textures/items/ore/dark_ore")
        .show(player)
    }
}


// world.afterEvents.itemUse.subscribe(event => {
//     if (event.itemStack.typeId == "minecraft:stick") {
//         PlayGuideGUI.MainRecipe(event.source);
//     }
//     if (event.itemStack.typeId == "minecraft:clock") {
//         PlayGuideGUI.SingleRecipe(event.source, 1);
//     }
// })