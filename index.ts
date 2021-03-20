import config from "./config";
import * as Discord from 'discord.js' ;
type Message = Discord.Message;
import ytdl from 'ytdl-core-discord';

import MessageCondition from './Conditions/MessageCondition';
import CombinedCondition from './Conditions/CombinedCondition';
import ContainsCondition from './Conditions/ContainsCondition';
import PrefixCommandCondition from './Conditions/PrefixCommandCondition';
import { emojifyString, getRandomElement, sleep } from "./utils";
import MessageAction from "./MessageAction";

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

	clearInterval(statusInterval);
	discordClient.destroy();
	console.log('you pressed CTRL^C, logging off... 😞');
});

const createActions = (msg: Message) => {
	const arr: MessageAction[] = [
		new MessageAction(
			new ContainsCondition(msg, 'please fuck me'),
			async () => {
				await msg.react('🇫');
				await msg.react('🇺');
				await msg.react('🇨');
				await msg.react('🇰');
				msg.react('⬆️');
			}
		), new MessageAction(
			new PrefixCommandCondition(msg, 'ssparse'),
			async (tokens: string[]) => msg.channel.send(JSON.stringify(tokens, undefined, 2))
		), new MessageAction(
			new ContainsCondition(msg, 'based'),
			() => msg.react('👺')
		), new MessageAction(
			new PrefixCommandCondition(msg, 'ssaudio'),
			async args => {
				const vc = msg.member.voice.channel;
				if (!vc || !vc.joinable)
					return msg.channel.send("sry can't join");

				
				let yTErr = false, yStream = ytdl(args[1]);
				yStream.then(y => {
					y.on('end', () => console.log('ytstream end'));
				}).catch(() => yTErr = true);

				const connection = await vc.join();
				const dispatcher = connection.play(await yStream);

				await sleep(30_000);
				connection.disconnect();
			}
		), new MessageAction(
			new PrefixCommandCondition(msg, 'sslist'),
			async () => {
				let str = '', i = 0;
				const l = arr.length - 1;
				for (; i < l; i++)
					str += arr[i].condition + ',\n';
				str += arr[i].condition;
				
				msg.channel.send(str);
			}
		), new MessageAction(
			new CombinedCondition(msg,
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
			() => msg.reply('it fucking works lol 👺')
		), new MessageAction(
			new PrefixCommandCondition(msg, 'ssemojify'),
			async (args: string[]) => msg.channel.send(emojifyString(args[1]))
		), new MessageAction(
            new PrefixCommandCondition(msg, 'sstart'),
            async () => {
				await msg.reply('you stoned?');

				try {
					await msg.channel.awaitMessages(
						(m: Discord.Message) =>
							m.author == msg.author && m.content.toLowerCase() == 'yes',
						{
							time: 30_000,
							max: 1,
							errors: ['time'],
						}
					);
					msg.channel.send('I\'m tellin your momma');
				} catch (e) {}

			}
        ),
	];
	return arr;
};