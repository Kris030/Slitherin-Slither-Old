import { Message } from 'discord.js';
import MessageCondition from './../MessageCondition'

export default class PrefixCommandCondition extends MessageCondition {

	protected readonly prefix: string;
	protected readonly parseFully: boolean;
	protected readonly ignoreEmpty: boolean;

	constructor(msg: Message, prefix: string, { parseFully, ignoreEmpty, }: PrefixCommandConditionOptions = { parseFully: true, ignoreEmpty: true, }) {
		super(msg);
		this.prefix = prefix;
		this.parseFully = parseFully;
		this.ignoreEmpty = ignoreEmpty;
	}

	public shouldRun(): boolean {
		this.parseArgs();
		return this.args.splice(0, 1)[0] == this.prefix;
	}
	
	public parseArgs() {
		this.args = [];
		const tokenSeparator = /[\s\n]/, str = this.msg.content;
		
		if (!this.parseFully) {
			const ind = str.search(tokenSeparator);
			if (ind == -1)
				this.args.push(str);
			else
				this.args = [str.substr(0, ind), str.substr(ind + 1, str.length - ind)];
			return;
		}

		const quotes = ["'", '"', '`',];
		let buff = '', inQuotes = false, escaped = false, quote: string;
		for (let i = 0; i < str.length; i++) {
			let c = str[i];

			if (!escaped && c == '\\') {
				escaped = !escaped;
				continue;
			}

			if (quotes.includes(c)) {
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

			if (!inQuotes && tokenSeparator.test(c)) {
				this.args.push(buff);
				buff = '';
				continue;
			}

			if (escaped) {
				switch (c) {
					case 'n':
						c = '\n';
						break;
					case 't':
						c = '\t';
						break;
					default:
						break;
				}
				escaped = false;
			}

			buff += c;
		}

		this.args.push(buff);

		this.args = this.ignoreEmpty ? this.args : this.args.filter((t: string) => t != '');
	}

	public toString(): string {
		return `⏯️ PrefixCondition ("${this.prefix}")`;
	}
}

type PrefixCommandConditionOptions = {
	parseFully?: boolean;
	ignoreEmpty?: boolean;
};

export {
	PrefixCommandConditionOptions,
}