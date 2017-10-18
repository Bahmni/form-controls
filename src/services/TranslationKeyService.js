
export default class TranslationKeyGenerator {
  constructor(value, id = 0) {
    this.value = value;
    this.id = id;
  }

  build() {
    const formatted = this.value.toUpperCase().replace(/ /g, '_');
    return `${formatted}_${this.id.toString()}`;
  }
}
