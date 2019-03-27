export class Test {
    private _name:string = "";
    constructor() {
        
    }
    
    public get name() : string {
        return this._name;
    }
    public set name(v : string) {
        this._name = v;
    }
    
}