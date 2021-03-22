import * as fs from 'fs';
import config from "./config";
import ytdl from 'ytdl-core-discord';
import * as Discord from 'discord.js' ;
import { User, Message } from 'discord.js';
import { traverseDialogTree, emojifyString, getRandomElement, ParseSupportedType, sleep } from "./utils";

import MessageAction from "./Actions/MessageAction";
import CombinedCondition from './Conditions/CombinedCondition';
import ContainsCondition from './Conditions/ContainsCondition';
import PrefixCommandCondition from './Conditions/PrefixCommandCondition';
import TypedPrefixCommandCondition from './Conditions/TypedPrefixCommandCondition';

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

discordClient.on('guildCreate', g => {
	g.systemChannel.send('I\'m here virgins');
});

discordClient.on('message', async (msg: Message) => {
	if (msg.author == discordClient.user)
		return;

	const messageActions = createActions(msg);
	//for (const messageAction of messageActions)
	//	messageAction.tryRun();

	const b = await Promise.all(messageActions.map(a => a.tryRun()));
	const ran = b.filter(x => x), ranC = ran.length, any = ranC != 0;
	
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
			new ContainsCondition(msg, 'based'), () => msg.react('👺')
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
			new PrefixCommandCondition(msg, 'ssemojify', { parseFully: false }),
			async (args: string[]) => {
				const str = emojifyString(args[1]);
				if (str.length <= 2000)
					msg.channel.send(str);
				else {
					await msg.channel.send('very long schlong 😏');
					
					console.log('args[1].length: ' + args[1].length);
					console.log('str.length: ' + str.length);
					console.log({str});
					
					let i = 0;
					for (; i < str.length; i += 2000) {
						console.log('i: ' + i + ' str.substr(i, 2000): ' + str.substr(i, 2000));
						
						await msg.channel.send(str.substr(i, 2000));
					}

				}
			}
		), new MessageAction(
            new PrefixCommandCondition(msg, 'sstart'),
            async () => traverseDialogTree(msg.channel as Discord.TextChannel, msg.author, {
						text: 'you stoned?',
						responses: [
							{
								answer: 'yes',
								branch: {
									text: 'I\'m telling your momma',
									responses: [
										{
											answer: (a: Message): boolean => a.mentions.members.has(discordClient.user.id),
											branch: {
												text: 'secret text lol'
											}
										}
									]
								}
							}, {
								answer: 'no',
								branch: {
									text: 'lol want some? 🥦',
									responses: [
										{
											answer: 'yes',
											branch: {
												text: 'sry we\'re out of stock'
											}
										}, {
											answer: 'no',
											branch: {
												text: 'then why did you ask in the first place... you probably have homework to do'
											}
										}
									]
								}
							},
						]
					}
				)
        ), new MessageAction(
			new TypedPrefixCommandCondition(msg, 'sstypes', [String, Number, Boolean, Date, User, URL, Object, BigInt, RegExp, ]),
			(args: ParseSupportedType[]) =>
				msg.channel.send(JSON.stringify(args, (_, v) => typeof v === 'bigint' ? v.toString() : v, 2))
		), new MessageAction(
			new TypedPrefixCommandCondition(msg, 'ssaudio', [URL,]),
			async (args: any[]) => {
				const vc = msg.member.voice.channel;
				if (!vc || !vc.joinable)
					return msg.channel.send("sry can't join");
				
				const url: URL = args[1];

				//let yTErr = false, yStream = ytdl(url.href);
				//yStream.then(y => {
				//	y.on('end', () => console.log('ytstream end'));
				//}).catch(() => yTErr = true);

				const alreadyIn = vc.members.has(discordClient.user.id);

				const connection = await vc.join();
				const dispatcher = connection.play(fs.createReadStream('C:/Users/Én/Music/Saját/Fav/LOLZ/Crazy Frog - Axel F.mp3'));//await yStream);

				if (!alreadyIn) {
					dispatcher.on('finish', async () => {
						await sleep(30_000);
						connection.disconnect();
					});
				}

			}
		), new MessageAction(
			new PrefixCommandCondition(msg, 'ssleave'),
			() => msg.member.voice?.channel.leave()
		),
	];
	return arr;
};