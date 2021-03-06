import { client, msg, slash } from "..";
import { SlashCommand as Command } from "../interfaces/Command";
import { I, D } from "../aliases/discord.js.js";
import { MessageActionRow, MessageButton } from "discord.js";
import mkembed from "../function/mkembed";

/** help 명령어 */
export default class HelpCommand implements Command {
  /** 해당 명령어 설명 */
  metadata = <D>{
    name: 'help',
    description: '명령어 확인',
    options: [{
      type: 'STRING',
      name: '명령어',
      description: '명령어 이름을 입력해 자세한 정보 확인',
      required: false
    }]
  };

  /** 실행되는 부분 */
  async run(interaction: I) {
    const commandName = interaction.options.getString('명령어');
    if (commandName) {
      const slashcommand = slash.commands.get(commandName);
      const msgcommand = msg.commands.get(commandName);
      let embed = mkembed({ color: 'ORANGE' });
      if (slashcommand) {
        embed.setTitle(`\` /${commandName} \` 명령어`)
          .setDescription(`이름: ${commandName}\n설명: ${slashcommand.metadata.description}`)
          .setFooter(`도움말: /help`);
      } else if (msgcommand) {
        embed.setTitle(`\` ${client.prefix}${commandName} \` 명령어`)
          .setDescription(`이름: ${commandName}\nAND: ${(msgcommand.metadata.aliases) ? msgcommand.metadata.aliases : ''}\n설명: ${msgcommand.metadata.description}`)
          .setFooter(`PREFIX: ${client.prefix}`);
      } else {
        embed.setTitle(`\` ${commandName} \` 명령어`)
          .setDescription(`명령어를 찾을수 없습니다.`)
          .setFooter(`도움말: /help`)
          .setColor('DARK_RED');
      }
      return await interaction.editReply({ embeds: [ embed ] });
    }
    let slashcmdembed = mkembed({
      title: `\` slash (/) \` 명령어`,
      description: `명령어\n명령어 설명`,
      color: 'ORANGE'
    });
    let msgcmdembed = mkembed({
      title: `\` 기본 (${client.prefix}) \` 명령어`,
      description: `명령어 [같은 명령어]\n명령어 설명`,
      footer: { text: `PREFIX: ${client.prefix}` },
      color: 'ORANGE'
    });
    slash.commands.forEach((cmd) => {
      slashcmdembed.addField(`**/${cmd.metadata.name}**`, `${cmd.metadata.description}`, true);
    });
    msg.commands.forEach((cmd) => {
      msgcmdembed.addField(`**${client.prefix}${cmd.metadata.name} [${(cmd.metadata.aliases) ? cmd.metadata.aliases : ''}]**`, `${cmd.metadata.description}`, true);
    });
    await interaction.editReply({ embeds: [ slashcmdembed, msgcmdembed ] });
  }
}