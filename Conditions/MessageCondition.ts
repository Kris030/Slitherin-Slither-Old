import { Message } from "discord.js";

export default abstract class MessageCondition {
	
	protected msg: Message;
	public args: any;

	constructor(msg: Message) {
		this.msg = msg;
	}

	public abstract shouldRun(): Promise<boolean> | boolean;
}