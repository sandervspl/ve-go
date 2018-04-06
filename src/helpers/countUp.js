// target = id of html element or var of previously selected html element where counting occurs
// startVal = the value you want to begin at
// endVal = the value you want to arrive at
// decimals = number of decimal places, default 0
// duration = duration of animation in seconds, default 2
// options = optional object of options (see below)

export default class CountUp {
  // default options
  options = {
    useEasing: true, // toggle easing
    useGrouping: true, // 1,000,000 vs 1000000
    separator: ',', // character to use as a separator
    decimal: '.', // character to use as a decimal
    easingFn: (t, b, c, d) => c * (-Math.pow(2, -10 * t / d) + 1) * 1024 / 1023 + b, // optional custom easing function, default is Robert Penner's easeOutExpo
    formattingFn: this.formatNumber, // optional custom formatting function, default is formatNumber above
    prefix: '', // optional text before the result
    suffix: '', // optional text after the result
    numerals: [], // optionally pass an array of custom numerals for 0-9
  };

  constructor({ target, startVal, endVal, decimals, duration, options, onCount }) {
    this.target = target;
    this.startVal = startVal;
    this.endVal = endVal;
    this.decimals = decimals;
    this.duration = duration;
    this.options = { ...this.options, ...options };
    this.onCount = onCount;

    if (this.options.separator === '') {
      this.options.useGrouping = false;
    } else {
      // ensure the separator is a string (formatNumber assumes this)
      this.options.separator = this.options.separator.toString();
    }

    // make sure requestAnimationFrame and cancelAnimationFrame are defined
    // polyfill for browsers without native support
    // by Opera engineer Erik Möller
    let lastTime = 0;
    const vendors = ['webkit', 'moz', 'ms', 'o'];

    for (let x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
      window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
      window.cancelAnimationFrame =
        window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame'];
    }

    if (!window.requestAnimationFrame) {
      window.requestAnimationFrame = (callback) => {
        const currTime = new Date().getTime();
        const timeToCall = Math.max(0, 16 - (currTime - lastTime));
        const id = window.setTimeout(() => callback(currTime + timeToCall), timeToCall);

        lastTime = currTime + timeToCall;

        return id;
      };
    }

    if (!window.cancelAnimationFrame) {
      window.cancelAnimationFrame = id => clearTimeout(id);
    }

    // format startVal on initialization
    if (this.initialize()) {
      this.printValue(this.startVal);
    }
  }

  formatNumber = (num) => {
    const neg = num < 0;
    let x;
    let x1;
    let x2;
    let x3;
    let i;
    let len;

    num = Math.abs(num).toFixed(this.decimals);
    num += '';
    x = num.split('.');
    x1 = x[0];
    x2 = x.length > 1 ? this.options.decimal + x[1] : '';
    if (this.options.useGrouping) {
      x3 = '';
      for (i = 0, len = x1.length; i < len; ++i) {
        if (i !== 0 && i % 3 === 0) {
          x3 = this.options.separator + x3;
        }
        x3 = x1[len - i - 1] + x3;
      }
      x1 = x3;
    }
    // optional numeral substitution
    if (this.options.numerals.length) {
      x1 = x1.replace(/[0-9]/g, w => this.options.numerals[+w]);
      x2 = x2.replace(/[0-9]/g, w => this.options.numerals[+w]);
    }
    return (neg ? '-' : '') + this.options.prefix + x1 + x2 + this.options.suffix;
  };

  ensureNumber = n => typeof n === 'number' && !isNaN(n);

  initialize = () => {
    if (this.initialized) {
      return true;
    }

    this.error = '';
    this.d = typeof this.target === 'string' ? document.getElementById(this.target) : this.target;

    this.startVal = Number(this.startVal);
    this.endVal = Number(this.endVal);

    // error checks
    if (this.ensureNumber(this.startVal) && this.ensureNumber(this.endVal)) {
      this.decimals = Math.max(0, this.decimals || 0);
      this.dec = Math.pow(10, this.decimals);
      this.duration = Number(this.duration) * 1000 || 2000;
      this.countDown = this.startVal > this.endVal;
      this.frameVal = this.startVal;
      this.initialized = true;

      return true;
    }

    this.error = '[CountUp] startVal (' + this.startVal + ') or endVal (' + this.endVal + ') is not a number';

    return false;
  };

  // Print value to target
  printValue = (value) => {
    if (!this.d) {
      return;
    }

    const result = this.options.formattingFn(value);

    if (this.d.tagName === 'INPUT') {
      this.d.value = result;
    } else if (this.d.tagName === 'text' || this.d.tagName === 'tspan') {
      this.d.textContent = result;
    } else {
      this.d.innerHTML = result;
    }
  };

  count = (timestamp) => {
    if (!this.startTime) {
      this.startTime = timestamp;
    }

    this.timestamp = timestamp;
    const progress = timestamp - this.startTime;
    this.remaining = this.duration - progress;

    // to ease or not to ease
    if (this.options.useEasing) {
      if (this.countDown) {
        this.frameVal = this.startVal - this.options.easingFn(progress, 0, this.startVal - this.endVal, this.duration);
      } else {
        this.frameVal = this.options.easingFn(progress, this.startVal, this.endVal - this.startVal, this.duration);
      }
    } else if (this.countDown) {
      this.frameVal = this.startVal - (this.startVal - this.endVal) * (progress / this.duration);
    } else {
      this.frameVal = this.startVal + (this.endVal - this.startVal) * (progress / this.duration);
    }

    // don't go past endVal since progress can exceed duration in the last frame
    if (this.countDown) {
      this.frameVal = this.frameVal < this.endVal ? this.endVal : this.frameVal;
    } else {
      this.frameVal = this.frameVal > this.endVal ? this.endVal : this.frameVal;
    }

    // decimal
    this.frameVal = Math.round(this.frameVal * this.dec) / this.dec;

    // format and print value
    this.printValue(this.frameVal);

    if (this.onCount != null) {
      this.onCount(this.frameVal);
    }

    // whether to continue
    if (progress < this.duration) {
      this.rAF = requestAnimationFrame(this.count);
    } else if (this.callback) {
      this.callback();
    }
  };

  // start your animation
  start = (callback) => {
    if (!this.initialize()) {
      return;
    }

    this.callback = callback;
    this.rAF = requestAnimationFrame(this.count);
  };

  // toggles pause/resume animation
  pauseResume = () => {
    if (!this.paused) {
      this.paused = true;
      cancelAnimationFrame(this.rAF);
    } else {
      this.paused = false;

      delete this.startTime;

      this.duration = this.remaining;
      this.startVal = this.frameVal;
      requestAnimationFrame(this.count);
    }
  };

  // reset to startVal so animation can be run again
  reset = () => {
    this.paused = false;

    delete this.startTime;

    this.initialized = false;

    if (this.initialize()) {
      cancelAnimationFrame(this.rAF);
      this.printValue(this.startVal);
    }
  };

  // pass a new endVal and start animation
  update = (newEndVal) => {
    if (!this.initialize()) {
      return;
    }

    newEndVal = Number(newEndVal);

    if (!this.ensureNumber(newEndVal)) {
      this.error = '[CountUp] update() - new endVal is not a number: ' + newEndVal;
      return;
    }

    this.error = '';

    if (newEndVal === this.frameVal) {
      return;
    }

    cancelAnimationFrame(this.rAF);

    this.paused = false;

    delete this.startTime;

    this.startVal = this.frameVal;
    this.endVal = newEndVal;
    this.countDown = this.startVal > this.endVal;
    this.rAF = requestAnimationFrame(this.count);
  };

  version = () => '1.9.3';
}
