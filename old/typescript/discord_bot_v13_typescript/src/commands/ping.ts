import { client } from "..";
import { SlashCommand as Command } from "../interfaces/Command";
import { I, D } from "../aliases/discord.js";
import { MessageActionRow, MessageButton } from "discord.js";
import mkembed from "../function/mkembed";

/** 핑 명령어 */
export default class PingCommand implements Command {
  /** 해당 명령어 설명 */
  metadata = <D>{
    name: 'ping',
    description: 'Ping!'
  };

  /** 실행되는 부분 */
  async run(interaction: I) {
    const id = Math.random().toString(36).substr(2, 5);
    const retryBtn = new MessageButton({ customId: id, label: '다시 측정', style: 'SUCCESS' });
    const actionRow = new MessageActionRow({ components: [retryBtn] });

    await interaction.editReply({
      embeds: [
        mkembed({
          title: `Pong!`,
          description: `**${client.ws.ping}ms**`,
          color: 'ORANGE'
        })
      ], components: [actionRow]
    });
    const i = await interaction.channel?.awaitMessageComponent({
      filter: (i) => i.customId === id && i.user.id === interaction.user.id,
      componentType: 'BUTTON'
    });
    if (!i) return;
    await i.deferReply();
    
    this.run(i as unknown as I);
  }
}