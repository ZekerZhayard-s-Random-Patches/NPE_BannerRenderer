
var ASMAPI = Java.type("net.minecraftforge.coremod.api.ASMAPI");
var Opcodes = Java.type("org.objectweb.asm.Opcodes");
var InsnNode = Java.type("org.objectweb.asm.tree.InsnNode");
var JumpInsnNode = Java.type("org.objectweb.asm.tree.JumpInsnNode");
var LabelNode = Java.type("org.objectweb.asm.tree.LabelNode");
var MethodInsnNode = Java.type("org.objectweb.asm.tree.MethodInsnNode");
var VarInsnNode = Java.type("org.objectweb.asm.tree.VarInsnNode");

function initializeCoreMod() {
    return {
        "BannerRenderer_renderPatterns": {
            "target": {
                "type": "METHOD",
                "class": "net/minecraft/client/renderer/blockentity/BannerRenderer",
                "methodName": "m_112074_",
                "methodDesc": "(Lcom/mojang/blaze3d/vertex/PoseStack;Lnet/minecraft/client/renderer/MultiBufferSource;IILnet/minecraft/client/model/geom/ModelPart;Lnet/minecraft/client/resources/model/Material;ZLjava/util/List;Z)V"
            },
            "transformer": function (mn) {
                var insnList = mn.instructions.toArray();
                var label = new LabelNode();

                var target = false;
                for (var i = 0; i < insnList.length; i++) {
                    var node = insnList[i];
                    if (node.getOpcode() === Opcodes.INVOKESTATIC && node.owner.equals("net/minecraft/client/renderer/Sheets") && node.name.equals(ASMAPI.mapMethod("m_173383_")) && node.desc.equals("(Lnet/minecraft/world/level/block/entity/BannerPattern;)Lnet/minecraft/client/resources/model/Material;")) {
                        target = true;
                    }
                    if (target && node.getOpcode() === Opcodes.ASTORE) {
                        mn.instructions.insert(node, node = new VarInsnNode(Opcodes.ALOAD, node.var));
                        mn.instructions.insert(node, node = new JumpInsnNode(Opcodes.IFNULL, label));
                        break;
                    }
                }

                for (var i = insnList.length - 1; i >= 0; i--) {
                    var node = insnList[i];
                    if (node.getOpcode() === Opcodes.IINC) {
                        mn.instructions.insertBefore(node, label);
                        break;
                    }
                }
                return mn;
            }
        }
    };
}