//


class Timer {

  constructor(flag) {
    this.finishDate = null;
    this.beginDate = flag ? new Date() : null;
  }

  stop() {
    if (this.finishDate == null) {
      this.finishDate = new Date();
    }
  }

  get count() {
    let beginDate = this.beginDate;
    if (beginDate) {
      let endDate = this.finishDate || new Date();
      let count = Math.floor((endDate.getTime() - beginDate.getTime()) / 1);
      if (count > 3600000) {
        count = 3600000;
      }
      return count;
    } else {
      return null;
    }
  }

}
