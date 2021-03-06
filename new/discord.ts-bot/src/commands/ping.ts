import { client } from "..";
import { check_permission as ckper, embed_permission as emper } from "../function/permission";
import { Command } from "../interfaces/Command";
import { I, D, M, B, S } from "../aliases/discord.js";
import { MessageActionRow, MessageButton, MessageEmbed } from "discord.js";
import MDB from "../database/Mongodb";

/**
 * DB
 * let guildDB = await MDB.get.guild(interaction);
 * 
 * check permission(role)
 * if (!(await ckper(interaction))) return await interaction.editReply({ embeds: [ emper ] });
 */

/** 핑 명령어 */
export default class PingCommand implements Command {
  /** 해당 명령어 설명 */
  name = "ping";
  visible = true;
  description = "PONG!";
  information = "핑 확인";
  aliases = [ "핑" ];
  metadata = <D>{
    name: this.name,
    description: this.description
  };
  msgmetadata?: { name: string; des: string; }[] = undefined;

  /** 실행되는 부분 */
  async slashrun(interaction: I) {
    return await interaction.editReply(this.ping());
  }
  async msgrun(message: M, args: string[]) {
    return message.channel.send(this.ping()).then(m => client.msgdelete(m, 3));
  }
  async buttonrun(interaction: B, args: string[]) {
    return await interaction.editReply(this.ping());
  }

  ping(): { embeds: [ MessageEmbed ], components: [ MessageActionRow ] } {
    const actionRow = new MessageActionRow().addComponents(
      new MessageButton()
        .setCustomId("ping-restart")
        .setLabel("다시 측정")
        .setStyle("SUCCESS")
    );
    const embed = client.mkembed({
      title: `Pong!`,
      description: `**${client.ws.ping}ms**`,
      color: client.embedcolor
    });
    return { embeds: [ embed ], components: [ actionRow ] };
  }
}