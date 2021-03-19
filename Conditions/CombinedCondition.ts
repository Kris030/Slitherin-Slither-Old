import { Message } from "discord.js";
import { indent } from "../utils";
import MessageCondition from "./MessageCondition";

export default class CombinedCondition extends MessageCondition {

	private readonly parts: MessageCondition[];

	constructor(msg: Message, ...parts: MessageCondition[]) {
		super(msg);
		this.parts = parts;
	}

	public async shouldRun() {
		return (await Promise.all(this.parts.map(p => p.shouldRun()))).every(x => x);
	}

	public toString(): string {
		let str = '↕️ CombinedCondition {\n', i = 0;

		const plen = this.parts.length - 1, line = () => indent(this.parts[i].toString(), 6, ' ');
		for (; i < plen; i++)
			str += line() + ',\n';
		str += line() + '\n';

		return str + '}';
	}
	
}