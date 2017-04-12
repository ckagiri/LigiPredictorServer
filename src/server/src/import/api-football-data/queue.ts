export class Queue { 
  private tokensInInterval: number;
  private tokensLeftInInterval: number;
  private timeInterval: number;
  private jobs: any[]; 
  private pending: any[];
  private active: boolean;
  private timer: any;

  constructor(limit: number, timeInterval: number){
    this.tokensInInterval = limit;
    this.tokensLeftInInterval = limit;
    this.timeInterval = timeInterval;

    this.jobs = [];
    this.pending = [];

    this.active = false;
  }

  start() {       
    if (this.active) {
        return;
    }

    this.active = true;
    this.startTimer();
    this.nextJob();
  }

  addJob(job: any) {
    this.jobs.push(job);

    if (!this.active) {
      this.start();
    }
  }

  jobWrapper(job: any) {
    return () => {
      if (this.tokensLeftInInterval > 0) {
        this.tokensLeftInInterval--;
        job.start(this);
        this.nextJob();
      } else {
        this.pending.push(this.jobWrapper(job));
      }
    }
  }

  nextJob() {
    if (this.jobs.length > 0) {
      let job = this.jobs.pop();
      this.jobWrapper(job)();
    } else {
      this.cleanUp();
    }
  }

  startTimer() {
    this.timer = setTimeout(() => {
      this.tokensLeftInInterval = this.tokensInInterval;
      for (let pendingJob of this.pending) {
        if (this.tokensLeftInInterval > 0) {
            pendingJob();
        } else {
            break;
        }
      }    
    }, this.timeInterval);
  } 

  cleanUp() {
    this.pending.push(() => {
      if (!this.active) {
          clearInterval(this.timer);
      }
    });
    this.active = false;
  }
}