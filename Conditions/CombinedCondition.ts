import { Message } from "discord.js";
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
    
}