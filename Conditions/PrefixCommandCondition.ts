import MessageCondition from './MessageCondition'
import { Message } from "discord.js";

export default class PrefixCommandCondition extends MessageCondition {

	private readonly prefix: string;
	private readonly parse: boolean;
	constructor(msg: Message, prefix: string, parse: boolean = true) {
		super(msg);
		this.prefix = prefix;
		this.parse = parse;
	}

	public shouldRun(): boolean {
		const ts = PrefixCommandCondition.parseArgs(this.msg.content),
			  b = ts.length > 0 && ts[0] == this.prefix;

		if (!b)
			return false;

		this.args = ts;
		
		return true;
	}

	public toString(): string {
		return `⏯️ PrefixCondition ["${this.prefix}"]`;
	}
	
	public static parseArgs(str: string): string[] {

		const tokens: string[] = [];
		
		let buff = '', inQuotes = false, escaped = false, quote: string;
		for (let i = 0; i < str.length; i++) {
			let c = str[i];

			if (!escaped && c == '\\') {
				escaped = !escaped;
				continue;
			}

			if (c == "'" || c == '"' || c == '`') {
				if (inQuotes) {
					if (c == quote && !escaped) {
						inQuotes = false;
						quote = undefined;
						continue;
					}
				} else if (!escaped) {
					inQuotes = true;
					quote = c;
					continue;
				}
			}

			if (!inQuotes && /[\s\n]/.test(c)) {
				tokens.push(buff);
				buff = '';
				continue;
			}

			if (escaped) {
				switch (c) {
					case 'n':
						c = '\n';
						break;
				
					default:
						break;
				}
			}

			escaped = false;
			buff += c;
			
		}

		tokens.push(buff);

		return tokens;
	}
}