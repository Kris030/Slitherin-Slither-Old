import { Message } from "discord.js";
import { ParseSupportedType, parseType } from "../utils";
import PrefixCommandCondition, { PrefixCommandConditionOptions } from "./PrefixCommandCondition";

export default class TypedPrefixCommandCondition extends PrefixCommandCondition {

	public readonly requiredParams: ParseSupportedType[];
	public readonly optionalParams: ParseSupportedType[];
	constructor(msg: Message, prefix: string, requiredParams: ParseSupportedType[], optionalparams?: ParseSupportedType[], options: PrefixCommandConditionOptions = { parseFully: true, ignoreEmpty: true, }) {
		super(msg, prefix, options);
		this.requiredParams = requiredParams;
		this.optionalParams = optionalparams;
	}

	public parseArgs() {
		super.parseArgs();
		if (this.args.length < 2)
			return;
		
		let i = 1;
		for (; i < this.requiredParams.length; i++) {
			try {
				this.args[i] = parseType(this.args[i], this.requiredParams[i - 1]);
			} catch (e) {
				this.errors.push(i);
			}
		}

		for (; i < this.requiredParams.length + this.optionalParams.length; i++) {
			try {
				this.args[i] = parseType(this.args[i], this.optionalParams[i - 1]);
			} catch {}
		}

		return this.errors;
	}
}
