import React from "react";
import { expect } from "@jest/globals";
import { render } from "@testing-library/react";

function isReactJSXElement(received: unknown): received is React.ReactElement {
  return (
    typeof received === "object" &&
    received !== null &&
    "$$typeof" in received &&
    received.$$typeof === Symbol.for("react.element")
  );
}

export function toMatchJSX(received: unknown, expected: unknown) {
  if (false === isReactJSXElement(received)) {
    return {
      pass: false,
      message: () => "Expected a JSX element",
    };
  }

  if (false === isReactJSXElement(expected)) {
    return {
      pass: false,
      message: () => "Expected a JSX element",
    };
  }

  expect(render(received).asFragment().firstChild).toEqual(
    render(expected).asFragment().firstChild,
  );

  return {
    pass: true,
    message: () => "loo",
  };
}

declare module "expect" {
  interface AsymmetricMatchers {
    toMatchJSX(expected: React.JSX.Element): void;
  }
  interface Matchers<R> {
    toMatchJSX(expected: React.JSX.Element): R;
  }
}
