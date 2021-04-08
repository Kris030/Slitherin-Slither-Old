import { Client, User } from 'discord.js';

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
					.replace(/ /g, '🟦 ')
			)
		)
	);
}

export type ParseSupportedType = String | Number | Boolean | Date | User | URL | Object | BigInt | RegExp;

export function parseType(str: string, type: ParseSupportedType, client: Client): ParseSupportedType {
	switch (type) {
		case String: return str;
		case Number: return parseInt(str);
		case Boolean: return Boolean(str);
		case Object: return JSON.parse(str);
		case Date: return new Date(str);
		case URL: return new URL(str);
		case BigInt: return BigInt(str);
		case RegExp: return new RegExp(str);
		case User: return userFromMention(str, client);
		default: throw 'Unsupported type ' + type;
	}
}

export function isMention(str: string): boolean {
	return /\<[\!\&\@]{0,2}\d{18}\>/.test(str);
}

export function userFromMention(str: string | User, client?: Client): string | User {
	if (str instanceof User)
		return str;
	if (!isMention(str))
		throw 'Not a mention: ' + str;

	str = str.slice(2, -1);
	if (str.startsWith('!'))
		str = str.slice(1);

	return client ? client.users.cache.get(str) : str;
}

import fs from 'fs'

let emojisReverse: { [emoji: string]: string; };

function loadReverseEmojis() {
	if (emojisReverse)
		return;
	emojisReverse = JSON.parse(fs.readFileSync('Utils/reverse_emojis.json').toString());
}

export function replaceEmojis(msg: string) {
	loadReverseEmojis();
	
	for (const e in emojisReverse)
		msg = msg.replace(new RegExp(`\\${e}`, 'g'), `:${emojisReverse[e]}:`);
	return msg;
}

export function arrayToString(arr: any[], { separator=', ', begin='[', end=']' }: { separator?: string; begin?: string; end?: string } = {}): string {
	const l = arr.length - 1;
	let str = begin, i = 0;
	for (; i < l; i++)
		str += arr[i] + separator;
	return str + arr[i] + end;
}