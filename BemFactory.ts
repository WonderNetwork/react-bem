import classNames, { ClassName } from "./classNames";

export default class BemFactory {
  constructor(
    private readonly name: string,
    private autoMix: string | undefined = undefined,
  ) {}

  block(...modifiers: ClassName[]): string {
    return classNames(
      this.name,
      this.autoMix,
      this.prefixWith(this.name, modifiers),
    );
  }

  element(block: string, ...modifiers: ClassName[]): string {
    const blockName = `${this.name}__${block.trim()}`;
    return classNames(blockName, this.prefixWith(blockName, modifiers));
  }

  toString() {
    return this.block();
  }

  valueOf() {
    return this.block();
  }

  private prefixWith(prefix: string, modifier: ClassName[]) {
    return classNames(...modifier).replace(/^(?=.)|\s+/g, `$&${prefix}--`);
  }
}
