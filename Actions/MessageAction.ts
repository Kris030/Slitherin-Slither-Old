import MessageCondition from "./../Conditions/MessageCondition";

export default class MessageAction {
    
    public readonly condition: MessageCondition;
	public readonly callback: (args?: [], errors?: any[]) => any;
    public readonly runWithErrors: boolean;

    private _didRun: boolean;
    public get didRun() {
        return this.didRun;
    }

    constructor(condition: MessageCondition, callback: (args?: [], errors?: any[]) => any, runWithErrors=false) {
        this.condition = condition;
        this.callback = callback;
        this.runWithErrors = runWithErrors;
    }

    public async tryRun() {
        try {
            const shouldRun = await this.condition.shouldRun();
            
            if (shouldRun) {
                if (this.condition.errors.length == 0 || this.runWithErrors) {
                    this.callback(this.condition.args, this.condition.errors);
                    this._didRun = true;
                }
            }
        } catch (e) {
            console.error(e);
        }
        return this._didRun;
    }
}
