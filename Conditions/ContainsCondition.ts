import MessageCondition from './MessageCondition';
import { Message } from "discord.js";

export default class ContainsCondition extends MessageCondition {

	private readonly text: string;

	constructor(msg: Message, text: string) {
		super(msg);
		this.text = text;
	}

	public shouldRun(): boolean {
		return this.msg.content.includes(this.text);
	}

	public toString(): string {
		return `📥 ContainsCondition ["${this.text}"]`;
	}

}