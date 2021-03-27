import config from './config';
import ytdl from 'ytdl-core-discord';
import { putFaceOnImage } from './Utils/ImageUtils';
import Discord, { Channel, Client, Message, TextChannel } from 'discord.js' ;
import { arrayToString, emojifyString, getRandomElement, ParseSupportedType, replaceEmojis, sleep } from './Utils/Utils';

import MessageAction from './Actions/MessageAction';
import TextDialogTree from './Dialog/TextDialogTree';
import IndexedDialogTree from './Dialog/IndexedDialogTree';
import PrefixCommandCondition from './Conditions/Commands/PrefixCommandCondition';
import TypedPrefixCommandCondition from './Conditions/Commands/TypedPrefixCommandCondition';

const discordClient = new Client();

let statusInterval: NodeJS.Timeout;
discordClient.on('ready', () => {
	console.log('Logged in as ' + discordClient.user.tag);
	
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

discordClient.on('channelCreate', (c: Channel) => {
	if (c.isText())
		(c as TextChannel).send('first fuckers');
});

discordClient.on('message', async (msg: Message) => {
	if (msg.author == discordClient.user)
		return;

	const messageActions = createActions(msg);
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
			new PrefixCommandCondition(msg, 'sslist'),
			() => msg.channel.send(arrayToString(arr.map(a => a.condition), { separator: ',\n', begin: '', end: '' }))
		), new MessageAction(
			new PrefixCommandCondition(msg, 'ssemojify', { parseFully: false }),
			async (args: string[]) => {
				const str = emojifyString(args[0]);

				if (str?.length <= 2000) {
					msg.channel.send(str);
					return;
				}
				
				await msg.channel.send('very long schlong 😏');

				for (let i = 0; i < str.length; i += 2000) {
					let s = str.substr(i, 2000);
					if (replaceEmojis(s).length > 4500) {
						const h = s.length / 2;
						await msg.channel.send(s.substr(0, h));
						s = s.substring(h + 1);
					}
					await msg.channel.send(s);
				}

			}
		), new MessageAction(
			new PrefixCommandCondition(msg, 'sstart'),
			() => new TextDialogTree(msg.channel as Discord.TextChannel, msg.author, {
						prompt: 'you stoned?',
						responses: [
							{
								answer: 'yes',
								branch: {
									prompt: 'I\'m telling your momma',
								}
							}, {
								answer: 'no',
								branch: {
									prompt: 'lol want some? 🥦',
									responses: [
										{
											answer: 'yes',
											branch: {
												prompt: 'sry we\'re out of stock'
											}
										}, {
											answer: 'no',
											branch: {
												prompt: 'then why did you ask in the first place... you probably have homework to do'
											}
										}
									]
								}
							},
						]
					}
				).traverse()
		), new MessageAction(
			new TypedPrefixCommandCondition(msg, 'ssaudio', [URL]),
			async (args: ParseSupportedType[], errors: []) => {
				const vc = msg.member.voice.channel;
				if (!vc || !vc.joinable)
					return msg.channel.send('sry can\'t join');
				
				if (errors?.length > 0)
					return msg.channel.send('unable to parse a URL');
				
				const	ytStream = await ytdl((args[0] as URL).href),
						alreadyIn = vc.members.has(discordClient.user.id),
						connection = await vc.join(),
						dispatcher = connection.play(ytStream, { type: 'opus' });

				if (!alreadyIn) {
					dispatcher.on('finish', async () => {
						await sleep(30_000);
						connection.disconnect();
					});
				}

			}, true
		), new MessageAction(
			new PrefixCommandCondition(msg, 'ssleave'),
			() => msg.member.voice?.channel.leave()
		), new MessageAction(
			new PrefixCommandCondition(msg, 'ssoblivion'),
			async () =>
				msg.channel.send(JSON.stringify(await new IndexedDialogTree(msg.channel as Discord.TextChannel, msg.author, {
							prompt: 'hey, how you doin?',
							responses: [
								{
									answer: 'well, and you?',
									branch: {
										prompt: 'asdasdasd',
									}
								}, {
									answer: 'sad, my dog died last day',
									branch: {
										prompt: 'dsadsadsa',
									}
								},
							],
						}
					).traverse()
				)
			)
		), new MessageAction(
			new PrefixCommandCondition(msg, 'ssface'),
			async () => {
				msg.channel.send(
					await putFaceOnImage(msg.author,
						'https://media.discordapp.net/attachments/774322950484656138/813423069237608478/unknown.png',
						150, 20))
			}
		), new MessageAction(
			new PrefixCommandCondition(msg, 'ssconfig'),
			(args: string[]) => {
				if (!config.admins.includes(msg.author.id))
					return msg.channel.send('fuck off you\'re not an admin');

				const keyProvided = (args[1]?.length > 0);
				
				switch (args[0]) {
					case 'get':
						if (!keyProvided)
							return msg.channel.send('no shit provided');

						msg.channel.send('debug: ' + args[1] + ': ' + debugConfig[args[1]]);
						break;

					case 'set':
						
						if (!keyProvided)
							return msg.channel.send('no shit provided');
					
						if (debugConfig.constructor.prototype.hasOwnProperty(args[1]))
							return msg.channel.send('fuck off hakker');
				
						debugConfig[args[1]] = args[2];
						msg.channel.send('debug: set ' + args[1] + ' to ' + args[2]);
						break;

					case 'list':
						let l = 'Configs:\n';
						for (const key in debugConfig)
							l += `${key}: ${debugConfig[key]}\n`;
						msg.channel.send(l);
						break;

					default:
						msg.channel.send('get or set fucker');
						break;
				}
			}
		), new MessageAction(
			new PrefixCommandCondition(msg, 'ssdie'),
			async () => {
				if (!config.admins.includes(msg.author.id))
					return msg.channel.send('fuck off you\'re not an admin');
				await msg.channel.send('sure daddy I\'ll gladly die for you');
				discordClient.destroy();
				process.exit();
			}
		),
	];
	return arr;
};

const debugConfig = new Object();