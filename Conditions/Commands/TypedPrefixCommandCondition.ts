import { Message } from "discord.js";
import { arrayToString, ParseSupportedType, parseType } from "../../Utils/Utils";
import PrefixCommandCondition, { PrefixCommandConditionOptions } from "./PrefixCommandCondition";

export default class TypeCommandMiddleware extends PrefixCommandCondition {

	public readonly types: ParseSupportedType[];
	constructor(msg: Message, prefix: string, types: ParseSupportedType[], { parseFully, ignoreEmpty, }: PrefixCommandConditionOptions = { parseFully: true, ignoreEmpty: true, }) {
		super(msg, prefix, { parseFully, ignoreEmpty });
		this.types = types;
	}

	public parseArgs() {
		super.parseArgs();
		for (let i = 0; i < this.types.length; i++) {
			try {
				this.args[i + 1] = parseType(this.args[i + 1], this.types[i]);
			} catch (e) {
				this.errors.push(i);
			}
		}
	}
	
	public toString(): string {
		return `⏯️‼️ TypedCommandPrefixCondition ("${arrayToString(this.types.map((c: NewableFunction) => c.name))})`;
	}
}
