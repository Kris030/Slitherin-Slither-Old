
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
export function indent(str: string, indent: number, indenter: string = '\t') {
	if (indent < 0)
		throw "Indent should be greater than 0.";

	let repl = '';
	for (let i = 0; i < indent; i++)
		repl += indenter;

	return repl + str.replaceAll('\n', '\n' + repl);
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
		.replaceAll('0', '0️⃣\0')
		.replaceAll('1', '1️⃣\0')
		.replaceAll('2', '2️⃣\0')
		.replaceAll('3', '3️⃣\0')
		.replaceAll('4', '4️⃣\0')
		.replaceAll('5', '5️⃣\0')
		.replaceAll('6', '6️⃣\0')
		.replaceAll('7', '7️⃣\0')
		.replaceAll('8', '8️⃣\0')
		.replaceAll('9', '9️⃣\0');
}

export function emojiLetterString(str: string) {
	return str
	.replaceAll(/a/ig, '🇦\0')
	.replaceAll(/b/ig, '🇧\0')
	.replaceAll(/c/ig, '🇨\0')
	.replaceAll(/d/ig, '🇩\0')
	.replaceAll(/e/ig, '🇪\0')
	.replaceAll(/f/ig, '🇫\0')
	.replaceAll(/g/ig, '🇬\0')
	.replaceAll(/h/ig, '🇭\0')
	.replaceAll(/i/ig, '🇮\0')
	.replaceAll(/j/ig, '🇯\0')
	.replaceAll(/k/ig, '🇰\0')
	.replaceAll(/l/ig, '🇱\0')
	.replaceAll(/m/ig, '🇲\0')
	.replaceAll(/n/ig, '🇳\0')
	.replaceAll(/o/ig, '🇴\0')
	.replaceAll(/p/ig, '🇵\0')
	.replaceAll(/q/ig, '🇶\0')
	.replaceAll(/r/ig, '🇷\0')
	.replaceAll(/s/ig, '🇸\0')
	.replaceAll(/t/ig, '🇹\0')
	.replaceAll(/u/ig, '🇺\0')
	.replaceAll(/v/ig, '🇻\0')
	.replaceAll(/w/ig, '🇼\0')
	.replaceAll(/x/ig, '🇽\0')
	.replaceAll(/y/ig, '🇾\0')
	.replaceAll(/z/ig, '🇿\0');  
}

export function emojifyString(str: string) {
	return emojiLetterString(emojiNumberString(str));
}