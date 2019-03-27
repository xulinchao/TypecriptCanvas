/**
 * 移动
 */
export class Move {
    private posX:number = 0;
    private speedX:number = 10; //单位秒
    constructor() {
        
    }
    /**
     * 更新（单位为毫秒）
     * @param timestamp 
     * @param elapsedMsec 
     * @param intervalMsec 
     */
    public update(timestamp:number,elapsedMsec:number,intervalMsec:number):void
    {
        let t:number = intervalMsec/1000;
        //线性速度公式  this.posX = this.posX + this.speedX * t;
        this.posX += this.speedX * t;
        console.log("current posX:" + this.posX); 
    }
}