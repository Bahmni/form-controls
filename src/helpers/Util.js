
export class Util {
  static toInt(obj) {
    return Number.parseInt(obj, 10);
  }

  static increment(obj) {
    return Util.toInt(obj) + 1;
  }
}
