"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Queue = (function () {
    function Queue(limit, timeInterval) {
        this.tokensInInterval = limit;
        this.tokensLeftInInterval = limit;
        this.timeInterval = timeInterval;
        this.jobs = [];
        this.pending = [];
        this.active = false;
    }
    Queue.prototype.start = function () {
        if (this.active) {
            return;
        }
        this.active = true;
        this.startTimer();
        this.nextJob();
    };
    Queue.prototype.addJob = function (job) {
        this.jobs.push(job);
        if (!this.active) {
            this.start();
        }
    };
    Queue.prototype.jobWrapper = function (job) {
        var _this = this;
        return function () {
            if (_this.tokensLeftInInterval > 0) {
                _this.tokensLeftInInterval--;
                job.start(_this);
                _this.nextJob();
            }
            else {
                _this.pending.push(_this.jobWrapper(job));
            }
        };
    };
    Queue.prototype.nextJob = function () {
        if (this.jobs.length > 0) {
            var job = this.jobs.pop();
            this.jobWrapper(job)();
        }
        else {
            this.cleanUp();
        }
    };
    Queue.prototype.startTimer = function () {
        var _this = this;
        this.timer = setTimeout(function () {
            _this.tokensLeftInInterval = _this.tokensInInterval;
            for (var _i = 0, _a = _this.pending; _i < _a.length; _i++) {
                var pendingJob = _a[_i];
                if (_this.tokensLeftInInterval > 0) {
                    pendingJob();
                }
                else {
                    break;
                }
            }
        }, this.timeInterval);
    };
    Queue.prototype.cleanUp = function () {
        var _this = this;
        this.pending.push(function () {
            if (!_this.active) {
                clearInterval(_this.timer);
            }
        });
        this.active = false;
    };
    return Queue;
}());
exports.Queue = Queue;
//# sourceMappingURL=queue.js.map