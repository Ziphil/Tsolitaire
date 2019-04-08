//


class Random {

  constructor(seed) {
    this.x = 123456789;
    this.y = 362436069;
    this.z = 521288629;
    if (Number.isInteger(seed)) {
      this.w = seed;
    } else if (!isNaN(parseInt(seed))) {
      this.w = parseInt(seed);
    } else {
      this.w = Random.hash(seed);
    }
  }

  // 0 ～ n－1 の乱数を返します。
  next(n) {
    let t = this.x ^ (this.x << 11);
    this.x = this.y;
    this.y = this.z;
    this.z = this.w;
    this.w = (this.w ^ (this.w >>> 19)) ^ (t ^ (t >>> 8));
    // mod 計算 (0 を足すのは -0 が気持ち悪いから)
    let value = this.w % n + 0;
    if (value < 0) {
      value += n;
    }
    return value;
  }

  static hash(object) {
    let string = object + "";
    let hash = 0;
    for (let i = 0 ; i < string.length ; i += 2) {
      if (string.length == i + 1) {
        hash ^= string.charCodeAt(i) << 16;
      } else {
        hash ^= (string.charCodeAt(i) << 16) + string.charCodeAt(i + 1);
      }
    }
    return hash;
  }

}
