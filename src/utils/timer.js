export default class Timer {
  constructor() {
    this.start = this.getTime();
  }

  getTime() {
    return process.hrtime();
  }

  getElapsed() {
    const now = this.getTime();
    return this.compare(this.start, now);
  }

  compare(start, end) {
    const [s1, ns1] = start;
    const [s2, ns2] = end;
    const time1 = s1 + ns1 / 1000000000;
    const time2 = s2 + ns2 / 1000000000;
    return parseInt((time2 - time1) * 1000) / 1000;
  }
}
