import { Timer, TimerCallback } from "./Timer";

export class Application {
    
    public timers : Timer[ ] = [ ] ;

    private _timeId : number = -1 ;

    private _fps : number = 0 ;

    // public canvas : HTMLCanvasElement  ;

    // public isSupportMouseMove : boolean ;
    // protected _isMouseDown : boolean ;
    // _start成员变量用于标记当前Application是否进入不间断地循环状态     
    protected _start: boolean = false;
    // 由Window对象的requestAnimationFrame返回的大于0的id号     
    // 可以使用cancelAnimationFrame ( this ._requestId )来取消动画循环     
    protected _requestId: number = -1;
    // 用于基于时间的物理更新，这些成员变量类型前面使用了!，可以进行延迟赋值操作     
    protected _lastTime !: number;
    protected _startTime !: number;
    constructor() {

    }

    public start(): void {
        if (!this._start) {
            this._start = true;
            this._lastTime = -1;
            this._startTime = -1;
            this._requestId = requestAnimationFrame((msec: number): void => {
                this.step(msec)
            });
        }
    }

    public stop(): void {
        if (this._start) {
            window.cancelAnimationFrame(this._requestId);
            this._requestId = -1;
            this._lastTime = -1;
            this._startTime = -1;
            this._start = false;
        }
    }

    protected step(timeStamp: number): void {
        if (this._startTime === -1) this._startTime = timeStamp;
        if (this._lastTime === -1) this._lastTime = timeStamp;
         //计算当前时间点与第一次调用step时间点的差   
        let elapsedMsec = timeStamp - this._startTime;
         //计算当前时间点与上一次调用step时间点的差（可以理解为两帧之间的时间差）     
        let intervalSec = (timeStamp - this._lastTime);
        // if (intervalSec !== 0) {
        //     this . _fps = 1000.0 / intervalSec ;
        // }
        intervalSec /= 1000.0;
        this._lastTime = timeStamp;
        // this._handleTimers(intervalSec);
        this.update(elapsedMsec, intervalSec);
        this.render();

        requestAnimationFrame(this.step.bind(this));
    }

    /**
     * 正在进行中...
     */
    public isRunning ( ) : boolean {
        return this . _start ;
    }

    /**
     * // 进行基于时间的更新     
     * @param elapsedMsec 毫秒
     * @param intervalSec 秒
     */
    public update ( elapsedMsec : number , intervalSec : number ) : void { }

    /**
     * 渲染
     */
    public render  ( ) : void { }

    private _handleTimers ( intervalSec : number ) :  void {
        for ( let i = 0 ; i < this . timers . length ; i ++ ) {
            let timer : Timer = this . timers [ i ] ;
            if( timer . enabled === false ) {
                continue ;
            }
            timer . countdown -= intervalSec ;
            if ( timer . countdown < 0.0 ) {
                timer . callback ( timer . id , timer . callbackData ) ;
                if ( timer . onlyOnce === false ) {
                    timer . countdown = timer . timeout ; 
                } else {  
                    this . removeTimer ( timer . id ) ;
                }
            }
        }
    }
    
    public addTimer ( callback : TimerCallback , timeout : number = 1.0 , onlyOnce : boolean = false ,data : any = undefined ) : number {
        let timer : Timer
        let found : boolean = false ;
        for ( let i = 0 ; i < this . timers . length ; i ++ ) {
            let timer : Timer = this . timers [ i ] ;
            if ( timer . enabled === false ) {
                timer . callback = callback ;
                timer . callbackData = data ;
                timer . timeout = timeout ;
                timer . countdown = timeout ;
                timer . enabled = true ;
                timer . onlyOnce = onlyOnce ;
                return timer . id ;
            }
        }

        timer = new Timer ( callback ) ;
        timer . callbackData = data ;
        timer . timeout = timeout ;
        timer . countdown = timeout ;
        timer . enabled = true ;
        timer . id = ++ this . _timeId ; 
        timer . onlyOnce = onlyOnce ; 
      
        this . timers . push ( timer ) ;
        return timer . id ;
    }

    public removeTimer ( id : number ) : boolean {
        let found : boolean = false ;
        for ( let i = 0 ; i < this . timers . length ; i ++ ) {
            if ( this . timers [ i ] . id === id ) {
                let timer : Timer = this . timers [ i ] ;
                timer . enabled = false ; 
                found = true ;
                break ;
            }
        }
        return found ;
    }
}