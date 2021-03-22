import { Client, Message, TextChannel, User } from "discord.js";

/**
 * Returns a promise for waiting an amount of milliseconds.
 * @param ms The amount of time in milliseconds.
*/
export function sleep(ms: number): Promise<void> {
	return new Promise(res => setTimeout(res, ms));
}

/**
 * Returns a random element of the specified array.
 * @param array The array to return from.
 */
export function getRandomElement<T>(array: T[]): T {
	return array[Math.floor(Math.random() * array.length)];
}

/**
 * Returns a random element of the specified array that isn't in the other specified.
 * @param array The array to return from.
 * @param excludes The excludes.
*/
export function getRandomElementExcludes<T>(array: T[], excludes: T[]): T {
	let e: T;
	do
		e = getRandomElement(array);
	while (excludes.includes(e));
	return e;
}

/**
 * Indents all lines of a string.
 * 
 * @param str The string to indent.
 * @param level The indentation level.
 * @param indenter The string to indent with. A single tab by default.
 */
export function indent(str: string, level: number, indenter: string = '\t') {
	if (level < 0)
		throw "Indent should be greater than 0.";
	const repl = indenter.repeat(level);
	return repl + str.replace(/\n/g, '\n' + repl);
}

/**
 * Converts a number to decimal emojis.
 * 
 * @param n The number.
 */
export function emojiNumber(n: number) {
	return emojiNumberString(n.toString());
}

/**
 * Converts a string containing number to decimal emojis.
 * 
 * @param n The number.
 */
export function emojiNumberString(n: string) {
	return n
		.replace(/0/g, '0️⃣ ')
		.replace(/1/g, '1️⃣ ')
		.replace(/2/g, '2️⃣ ')
		.replace(/3/g, '3️⃣ ')
		.replace(/4/g, '4️⃣ ')
		.replace(/5/g, '5️⃣ ')
		.replace(/6/g, '6️⃣ ')
		.replace(/7/g, '7️⃣ ')
		.replace(/8/g, '8️⃣ ')
		.replace(/9/g, '9️⃣ ');
}

export function emojiLetterString(str: string) {
	return str
		.replace(/a/ig, '🇦 ')
		.replace(/b/ig, '🇧 ')
		.replace(/c/ig, '🇨 ')
		.replace(/d/ig, '🇩 ')
		.replace(/e/ig, '🇪 ')
		.replace(/f/ig, '🇫 ')
		.replace(/g/ig, '🇬 ')
		.replace(/h/ig, '🇭 ')
		.replace(/i/ig, '🇮 ')
		.replace(/j/ig, '🇯 ')
		.replace(/k/ig, '🇰 ')
		.replace(/l/ig, '🇱 ')
		.replace(/m/ig, '🇲 ')
		.replace(/n/ig, '🇳 ')
		.replace(/o/ig, '🇴 ')
		.replace(/p/ig, '🇵 ')
		.replace(/q/ig, '🇶 ')
		.replace(/r/ig, '🇷 ')
		.replace(/s/ig, '🇸 ')
		.replace(/t/ig, '🇹 ')
		.replace(/u/ig, '🇺 ')
		.replace(/v/ig, '🇻 ')
		.replace(/w/ig, '🇼 ')
		.replace(/x/ig, '🇽 ')
		.replace(/y/ig, '🇾 ')
		.replace(/z/ig, '🇿 ');
}

export function emojiSymbolString(str: string) {
	return str
		.replace(/\?/ig, '❓ ')
		.replace(/\!/ig, '❗ ')
		.replace(/\./ig, '**ₒ** ')
		.replace(/\,/ig, '**₎** ');
}

/**
 * Uses `emojiLetterString` and `emojiNumberString` on a string.
 * @param str The string to emojify.
 */
export function emojifyString(str: string) {
	return emojiSymbolString(
		emojiLetterString(
			emojiNumberString(
				str
				)
			)
		);
}

export type ParseSupportedType = String | Number | Boolean | Date | User | URL | Object | BigInt | RegExp;

export function parseType(str: string, type: ParseSupportedType): ParseSupportedType {
	switch (type) {
		case String: return str;
		case Number: return parseInt(str);
		case Boolean: return Boolean(str);
		case Object: return JSON.parse(str);
		case Date: return new Date(str);
		case URL: return new URL(str);
		case BigInt: return BigInt(str);
		case RegExp: return new RegExp(str);
		case User: return userFromMention(str);
		default: throw 'Unsupported type ' + type;
	}
}

export function isMention(str: string): boolean {
	return /\<[\!\&\@]{0,2}\d{18}\>/.test(str);
}

export function userFromMention(str: string, client?: Client): string | User {
	if (!isMention(str))
		throw 'Not a mention: ' + str;

	str = str.slice(2, -1);
	if (str.startsWith('!'))
		str = str.slice(1);

	return client ? client.users.cache.get(str) : str;
}

export type DialogBranch = {
	text: string;
	responses?: {
		answer: string | ((a: Message) => boolean),
		branch: DialogBranch
	}[];
};

export async function traverseDialogTree(channel: TextChannel, users: User | User[], tree: DialogBranch, { list_options = false, timeout = 60_000 }: { list_options?: boolean; timeout?: number; } = {}) {
	channel.send(tree.text);
	if (!tree.responses || tree.responses.length == 0)
		return;

	if (!Array.isArray(users))
		users = [users];

	if (list_options)
		for (const r of tree.responses)
			if (typeof(r.answer) == 'string')
				await channel.send(r.answer);

	try {
		let dt: DialogBranch;
		await channel.awaitMessages(
			(m: Message) => {
				let a: boolean;
				if (users)
					a = (users as User[]).includes(m.author);
				else
					a = true;
				
				return a && tree.responses.findIndex(x => {
					let b: boolean;
					if (typeof(x.answer) == 'string')
						b = x.answer == m.content;
					else if (typeof(x.answer) == 'function')
						b = x.answer(m);
					else
						b = false;
					
					if (b)
						dt = x.branch;
					return b;
				}) != -1;
			}, {
				time: timeout,
				max: 1,
				errors: ['time'],
			}
		);
		
		if (dt)
			await traverseDialogTree(channel, users, dt, {list_options, timeout });
	} catch (err) {}
}