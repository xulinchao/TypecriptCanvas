import {Move} from "./Move"
export class AnimationFrameStep{
    private moveTarget:Move;
    private start:number = 0;//start纪录的是第一次调用step函数的时间点，用于计算与第一次调用step的时间差，以毫秒为单位
    private lastTime:number = 0; //lastTime记录的是上一次调用step函数的时间点，用于计算两帧之间的时间差，以毫秒为单位 
    private count:number = 0;//用于纪录step函数运行次数
    constructor() {
        this.moveTarget = new Move();
    }

    /**
     * step函数用于计算 
     * 1.获取当前时间点与HTML程序启动时的时间差 : timestamp 
     * 2.获取当前时间点与第一次调用step时的时间差 : elapsedMsec 
     * 3.获取当前时间点与上一次调用step时的时间差 : intervalMsec 
     */
    public step(timestamp : number):void{
        //第一次调用本函数时，设置start和lastTime为timestamp     
        if ( ! this.start ) this.start = timestamp ;     
        if( ! this.lastTime) this.lastTime = timestamp ;     
        //计算当前时间点与第一次调用step时间点的差     
        let elapsedMsec = timestamp - this.start ;    
        //计算当前时间点与上一次调用step时间点的差（可以理解为两帧之间的时间差）     
        let intervalMsec = timestamp - this.lastTime ;    
        //记录上一次的时间戳     
        this.lastTime = timestamp ;     
        // 进行基于时间的更新     
        this.moveTarget.update ( timestamp , elapsedMsec,intervalMsec);

        window.requestAnimationFrame(this.step);
    }
}