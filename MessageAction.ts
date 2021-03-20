import MessageCondition from "./Conditions/MessageCondition";

export default class MessageAction {
    
    condition: MessageCondition;
	callback: Function;
	permissions: [];

    constructor(condition: MessageCondition, callback: Function) {

    }

}