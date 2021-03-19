import MessageCondition from './MessageCondition'
import { Message } from "discord.js";

export default class PrefixCommandCondition extends MessageCondition {

    private readonly prefix: string;
	private readonly confirmArgs: () => boolean;
    constructor(msg: Message, prefix: string, confirmArgs: () => boolean = undefined) {
        super(msg);
        this.prefix = prefix;
		this.confirmArgs = confirmArgs;
    }

    public shouldRun(): boolean {
        const ts = PrefixCommandCondition.parseArgs(this.msg.content),
              b = ts.length > 0 && ts[0] == this.prefix;

        if (!b)
			return false;

        this.args = ts;
		
		if (!this.confirmArgs)
			return true;
        return this.confirmArgs();
    }
    
	public static parseArgs(str: string): string[] {

		const tokens: string[] = [];
		
		let buff = '', inQuotes = false, escaped = false, quote;
		for (let i = 0; i < str.length; i++) {
			const c = str[i];

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

			if (!inQuotes && c == ' ') {
				tokens.push(buff);
				buff = '';
				continue;
			}

			buff += c;
			
		}

		tokens.push(buff);

		return tokens;
	}
}