import { Message } from "discord.js";

export default abstract class MessageCondition {

	public args: any;
	public errors: any[] = [];
	protected msg: Message;

	constructor(msg: Message) {
		this.msg = msg;
	}

	public abstract shouldRun(): Promise<boolean> | boolean;
}