import config from "./config";
import * as Discord from 'discord.js' ;
type Message = Discord.Message;
import ytdl from 'ytdl-core-discord';

import MessageCondition from './Conditions/MessageCondition';
import CombinedCondition from './Conditions/CombinedCondition';
import ContainsCondition from './Conditions/ContainsCondition';
import PrefixCommandCondition from './Conditions/PrefixCommandCondition';
import { emojifyString, getRandomElement, sleep } from "./utils";

const discordClient = new Discord.Client();

let statusInterval: NodeJS.Timeout;
discordClient.on('ready', () => {
	console.log(`Logged in as ${discordClient.user.tag}!`);

	const statuses: {
		name: string,
		options?: Discord.ActivityOptions
	}[] = [
		{
			name: 'you on the toilet',
			options: {
				type: 'WATCHING'
			}
		}, {
			name: 'during the lesson',
			options: {
				type: 'PLAYING'
			}
		}, {
			name: 'with titties',
			options: {
				type: 'PLAYING'
			}
		}, {
			name: 'to the cries',
			options: {
				type: 'LISTENING'
			}
		}, {
			name: 'the market',
			options: {
				type: 'COMPETING'
			}
		}, {
			name: 'custom status lol',
			options: {
				type: 'CUSTOM_STATUS'
			}
		},
	];
	const setStatus = () => {
		const s = getRandomElement(statuses);
		discordClient.user.setActivity(s.name, s.options);
	};
	setStatus();
	statusInterval = setInterval(setStatus, 30_000);
});

discordClient.on('message', async (msg: Message) => {
	if (msg.author == discordClient.user)
		return;

	const messageActions = createActions(msg);

	for (const messageAction of messageActions) {
		if (await messageAction.condition.shouldRun())
			messageAction.callback(messageAction.condition.args);
	}
});

discordClient.login(config.token);

process.on('SIGINT', () => {
	console.log('you pressed CTRL^C, logging off... 😞');

	clearInterval(statusInterval);
	for (const c of discordClient.voice.connections.values())
		c.disconnect();

	discordClient.destroy();
});

const createActions = (msg: Message) => {
	const arr: {
		condition: MessageCondition,
		callback: (args: any) => any
	}[] = [
		{
			condition: new ContainsCondition(msg, 'please fuck me'),
			callback: async () => {
				await msg.react('🇫');
				await msg.react('🇺');
				await msg.react('🇨');
				await msg.react('🇰');
				msg.react('⬆️');
			}
		}, {
			condition: new PrefixCommandCondition(msg, 'ssparse'),
			callback: async tokens =>
				msg.channel.send(JSON.stringify(tokens, undefined, 2))
		}, {
			condition: new ContainsCondition(msg, 'based'),
			callback: () =>
				msg.react('👺')
		}, {
			condition: new PrefixCommandCondition(msg, 'ssaudio'),
			callback: async args => {
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
		}, {
			condition: new PrefixCommandCondition(msg, 'sslist'),
			callback: async () => {
				let str = '', i = 0;
				const l = arr.length - 1;
				for (; i < l; i++)
					str += arr[i].condition + ',\n';
				str += arr[i].condition;
				
				msg.channel.send(str);
			}
		}, {
			condition:	new CombinedCondition(msg,
							new ContainsCondition(msg, 'contains1'),
							new ContainsCondition(msg, 'contains2'),
							new PrefixCommandCondition(msg, 'sswaffen'),
							new CombinedCondition(msg,
								new ContainsCondition(msg, 'contains3'),
								new CombinedCondition(msg,
									new ContainsCondition(msg, 'contains4'),
								),
							)
						),
			callback: (msg: Message) =>
				msg.reply('it fucking works lol 👺')
		}, {
			condition: new PrefixCommandCondition(msg, 'ssemojify'),
			callback: async (args: string[]) =>
				msg.channel.send(emojifyString(args[1]))
		},
	];
	return arr;
};