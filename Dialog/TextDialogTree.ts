import { Message } from 'discord.js';
import DialogTree, { DialogBranch } from './DialogTree';

export default class TextDialogTree extends DialogTree {
    protected getSelectedIndex(msg: Message, br: DialogBranch): number | Promise<number> {
        return br.responses.findIndex(r => {
            if (typeof r.answer == 'string')
                return r.answer == msg.content;
            else
                return (r.answer as ((s: Message) => boolean))(msg);
        });
    }
}
