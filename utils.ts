
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

	return repl + str.replace(/g\n/g, '\n' + repl);
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

export function emojifyString(str: string) {
	return emojiLetterString(emojiNumberString(str));
}