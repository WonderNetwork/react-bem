import React, { useMemo } from "react";
import classNames, { ClassNameHash } from "./classNames";
import BemFactory from "./BemFactory";

type TemplateArgs = [TemplateStringsArray, ...ClassNameHash[]];
type TemplateArgsZipped = (string | ClassNameHash)[];
type TemplateFn = (...args: TemplateArgs) => string;
type MixableTemplateFn = (...args: TemplateArgs) => Mixable;
type TemplateFnZipped = (args: TemplateArgsZipped) => string;
type Mixable = string & {
  toString: () => string;
  valueOf: () => string;
  mix: TemplateFn;
};

function taggedLiteral(fn: TemplateFnZipped): TemplateFn {
  function* zip(strings: string[], params: ClassNameHash[]) {
    yield strings.shift() as string;
    while (strings.length) {
      yield params.shift() as ClassNameHash;
      yield strings.shift() as string;
    }
  }

  return (
    modifiers: TemplateStringsArray | undefined = undefined,
    ...dynamic: ClassNameHash[]
  ) => fn([...zip([...(modifiers || [])], [...dynamic])]);
}

function allowMixing(fn: TemplateFn) {
  return (...args: TemplateArgs) => {
    const base = fn(...args);
    return {
      toString: () => base,
      valueOf: () => base,
      mix: taggedLiteral((mixes) => classNames(base, ...mixes)),
    };
  };
}

type BemHelper = string & {
  className: string;
  toString: () => string;
  valueOf: () => string;
  block: MixableTemplateFn;
  element: MixableTemplateFn;
  mix: TemplateFn;
};

function helperFactory(name: string, autoMix: string | undefined): BemHelper {
  const snakeName = name.replace(/([a-z])(?=[A-Z])/g, "$1-").toLowerCase();
  const bemFactory = new BemFactory(snakeName, autoMix);
  const className = bemFactory.toString();

  const toString = () => {
    return bemFactory.toString();
  };

  const valueOf = () => {
    return bemFactory.toString();
  };

  const block = allowMixing(
    taggedLiteral((modifiers) => bemFactory.block(...modifiers)),
  );

  const element = allowMixing((strings, ...modifiers) =>
    classNames(
      bemFactory.element(strings[0], ...modifiers),
      ...strings.slice(1),
    ),
  );

  const mix = (otherClasses: readonly string[]) => {
    return [bemFactory.toString(), otherClasses].join(" ");
  };

  return {
    className,
    toString,
    valueOf,
    block,
    element,
    mix,
  } as BemHelper & string;
}

type BemProps<P> = { bem: BemHelper } & P;
type OptionalClassName = {
  className?: string;
};

function createWrappedComponent<P>(
  name,
  Component: React.ComponentType<BemProps<P>>,
): React.ComponentType<P & OptionalClassName> {
  const WrappedComponent = (args: P) => {
    const parentMix = (args as OptionalClassName)?.className;
    const bem = useMemo(() => helperFactory(name, parentMix), [parentMix]);
    return <Component {...args} bem={bem} />;
  };
  WrappedComponent.displayName = `Bem(${name})`;
  return WrappedComponent;
}

export function withBem(Component) {
  const name = Component.displayName;
  if (!name) {
    console.warn(
      `withBem called on an anonymous component. Add .displayName to your component`,
      Component,
    );
  }
  return createWrappedComponent(name, Component);
}

withBem.named = createWrappedComponent;

export namespace withBem {
  export type props<T = {}> = BemProps<T>;
}
