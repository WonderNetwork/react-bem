const identity = Boolean;

export type ClassNameHash = Record<string, unknown>;
export type ClassNameSpec = string | undefined | null | false | ClassNameHash;
export type ClassName = ClassNameSpec | ClassNameSpec[];

export default function classNames(...args: ClassName[]): string {
  const toString = (input: ClassName) => {
    if (typeof input === "string") {
      return input.trim();
    }

    if (null === input || undefined === input || false === input) {
      return "";
    }

    if (Array.isArray(input)) {
      return classNames(...input);
    }

    const value = (condition: true | unknown, name: string) =>
      true === condition ? name : `${name}-${condition}`;

    // leaves us with `object`
    return Object.entries(input)
      .map(([name, condition]) => (condition ? value(condition, name) : null))
      .filter(identity)
      .join(" ");
  };

  return args.map(toString).filter(identity).join(" ");
}
