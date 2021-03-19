import config from "./config";
import * as Discord from 'discord.js' ;
type Message = Discord.Message;
import ytdl from 'ytdl-core-discord';

import MessageCondition from './Conditions/MessageCondition';
import CombinedCondition from './Conditions/CombinedCondition';
import ContainsCondition from './Conditions/ContainsCondition';
import PrefixCommandCondition from './Conditions/PrefixCommandCondition';
import { sleep } from "./utils";

const discordClient = new Discord.Client();

discordClient.on('ready', () => {
	console.log(`Logged in as ${discordClient.user.tag}!`);
});

discordClient.on('message', async msg => {
	if (msg.author == discordClient.user)
		return;

	const messageActions = createActions(msg);

	for (const messageAction of messageActions) {
		if (await messageAction.condition.shouldRun())
			messageAction.callback(msg, messageAction.condition.args);
	}
});

discordClient.login(config.token);

process.on('SIGINT', () => {
	console.log('you pressed CTRL^C, logging off... 😞');
	
	for (const c of discordClient.voice.connections.values())
		c.disconnect();

	discordClient.destroy();
});

const createActions: (msg: Message) => {
	condition: MessageCondition,
	callback: (msg: Message, args: any) => any
}[] = (msg: Message) => [
	{
		condition: new ContainsCondition(msg, 'please fuck me'),
		callback: async (msg: Message) => {
			await msg.react('🇫');
			await msg.react('🇺');
			await msg.react('🇨');
			await msg.react('🇰');
			msg.react('⬆️');
		}
	}, {
		condition: new PrefixCommandCondition(msg, 'ssay'),
		callback: async (msg: Message, tokens) =>
			msg.channel.send(JSON.stringify(tokens, undefined, 2))
	}, {
		condition:	new CombinedCondition(msg,
						new ContainsCondition(msg, 'contains1'),
						new ContainsCondition(msg, 'contains2'),
						new PrefixCommandCondition(msg, 'sswaffen'),
					),
		callback: (msg: Message) =>
			msg.reply('it fucking works lol 👺')
	}, {
		condition: new PrefixCommandCondition(msg, 'ssaudio'),
		callback: async (msg: Message, args) => {
			const vc = msg.member.voice.channel;
			if (!vc || !vc.joinable) {
				msg.channel.send("sry can't join");
				return;
			}
			
			const stream = await ytdl(args[1]);
			const connection = await vc.join();
			
			const dispatcher = connection.play(stream);

			await sleep(5000);
			connection.disconnect();
		}
	},
];
