import { Message, TextChannel, User } from 'discord.js';
import DialogTree, { DialogBranch, DialogTreeOptions } from './DialogTree';

export default class IndexedDialogTree extends DialogTree {

    constructor(channel: TextChannel, users: User | User[], root: DialogBranch, { timeout = 60_000, }: DialogTreeOptions = {}) {
        super(channel, users, root, { timeout, });

        

    }

    protected getSelectedIndex(msg: Message, br: DialogBranch): number | Promise<number> {
        const p = parseInt(msg.content);
        if (Number.isNaN(p) || p >= br.responses.length)
            return -1;
        return p;
    }

}