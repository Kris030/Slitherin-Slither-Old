import { Message, TextChannel, User } from 'discord.js';

export type DialogBranch = {
	prompt: string | ((a: TextChannel) => any | Promise<any>);
	responses?: {
		answer: string | ((a: Message) => any | Promise<boolean>),
		branch: DialogBranch
	}[];
};

export type DialogTreeOptions = {
	timeout?: number;
};

export default abstract class DialogTree {
	
	private readonly channel: TextChannel;
	private readonly root: DialogBranch;
	private readonly users: User[];
	public readonly path: number[];

	private timeout: number;

	protected abort: boolean;

	constructor(channel: TextChannel, users: User | User[], root: DialogBranch, { timeout = 60_000, }: DialogTreeOptions = {}) {
		this.channel = channel;
		this.users = Array.isArray(users) ? users : [users];
		this.root = root;
		this.timeout = timeout;
		this.path = [];
	}

	static conversation = 0;
	public async traverse() {
		const c = DialogTree.conversation++;
		console.log(`Conversation ${c} started`);

		let b = this.root;
		while (!this.abort && b.responses?.length > 0) {
			
            if (typeof b.prompt == 'string')
                await this.channel.send(b.prompt);
            else
                await (b.prompt as ((s: TextChannel) => any))(this.channel);

			let res: Message, ind = -1;
			while (!this.abort && ind < 0) {

				try {
					res = (await this.channel.awaitMessages(
						(msg: Message) => this.users.includes(msg.author), {
						max: 1,
						time: this.timeout,
					})).first();
				} catch (e) {}

				ind = await this.getSelectedIndex(res, b);
			}

			if (this.abort)
				break;

			this.path.push(ind);
			b = b.responses[ind].branch;
			
			console.log(`Conversation ${c} path changed: [${this.path}]`);
		}
		if (typeof b.prompt == 'string')
			await this.channel.send(b.prompt);
		else
			await (b.prompt as ((s: TextChannel) => any))(this.channel);

		console.log(`Conversation ${c} ended`);

		return this.path;
	}
	
	protected abstract getSelectedIndex(msg: Message, br: DialogBranch): number | Promise<number>;
}