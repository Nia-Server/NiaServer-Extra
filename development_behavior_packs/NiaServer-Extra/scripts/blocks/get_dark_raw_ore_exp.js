import { world, EquipmentSlot } from "@minecraft/server";



const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
world.beforeEvents.worldInitialize.subscribe(({ blockComponentRegistry }) => {
    blockComponentRegistry.registerCustomComponent("mcnia:dark_raw_ore_xp_reward", {
        onPlayerDestroy({ block, dimension, player }) {
            world.afterEvents.playerSpawn.subscribe((event) => {
                if (event.initialSpawn) {
                    system.runTimeout(() => {
                        event.player.sendMessage("test");
                    },10);
                }
            });
            const equippable = player?.getComponent("minecraft:equippable");
            if (!equippable) return;

            const itemStack = equippable.getEquipment(EquipmentSlot.Mainhand);
            if (itemStack?.typeId != "minecraft:diamond_pickaxe" || itemStack?.typeId != "minecraft:netherite_pickaxe") return;

            const enchantable = itemStack.getComponent("minecraft:enchantable");
            const silkTouch = enchantable?.getEnchantment("silk_touch");
            if (silkTouch) return;

            const xpAmount = randomInt(0, 3);
            for (let i = 0; i < xpAmount; i++) {
                dimension.spawnEntity("minecraft:xp_orb", block.location);
            }
        },
    });
});