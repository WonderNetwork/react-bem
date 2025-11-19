import React from "react";
import { render } from "@testing-library/react";
import { withBem } from "./index";
import { describe, expect, test } from "@jest/globals";

describe("withBem", () => {
  const sut = (fn, className = undefined) => {
    const Component = withBem.named("Alpha", ({ bem }) => (
      <div data-testid="component" className={fn(bem)} />
    ));
    const { getByTestId } = render(<Component className={className} />);
    return getByTestId("component" as any).className;
  };

  test("simplest case for block name", () => {
    expect(sut((bem) => bem)).toBe("alpha");
  });

  test("using root className", () => {
    expect(sut(({ className }) => className)).toBe("alpha");
  });

  test("simplest test case for element", () => {
    expect(sut(({ element }) => element`bravo`)).toBe("alpha__bravo");
  });

  test("block with modifiers", () => {
    expect(sut(({ block }) => block`bravo`)).toBe("alpha alpha--bravo");
  });

  test("block with dynamic modifiers", () => {
    expect(sut(({ block }) => block`${{ bravo: true }}`)).toBe(
      "alpha alpha--bravo",
    );
  });

  test("mixing block with className passed from parent", () => {
    expect(sut(({ block }) => block``, "mixed-in")).toBe("alpha mixed-in");
  });

  test("block with modifiers and a parent mix", () => {
    expect(sut(({ block }) => block`bravo`, "mixed-in")).toBe(
      "alpha mixed-in alpha--bravo",
    );
  });

  test("element does not get mixed with parent className", () => {
    expect(sut(({ element }) => element`foo`, "mixed-in")).toBe("alpha__foo");
  });

  test("advanced modifiers", () => {
    expect(
      sut(
        ({ block }) =>
          block`bravo ${{ charlie: true, delta: false }} echo foxtrot`,
      ),
    ).toBe("alpha alpha--bravo alpha--charlie alpha--echo alpha--foxtrot");
  });

  test("block with a mix helper", () => {
    expect(sut(({ mix }) => mix`px-5`)).toBe("alpha px-5");
  });

  test("block with a mix helper and a parent mix", () => {
    expect(sut(({ mix }) => mix`px-5`, "parent-mix")).toBe(
      "alpha parent-mix px-5",
    );
  });

  test("block with a modifier & mix", () => {
    expect(sut(({ block }) => block`bravo`.mix`px-5`)).toBe(
      "alpha alpha--bravo px-5",
    );
  });

  test("block with modifier and advanced mix", () => {
    expect(
      sut(({ block }) => block`bravo`.mix`px-5 ${"foo"} ${{ bar: true }}`),
    ).toBe("alpha alpha--bravo px-5 foo bar");
  });

  test("element with simple modifier", () => {
    expect(sut(({ element }) => element`bravo`)).toBe("alpha__bravo");
  });

  test("element with a mix", () => {
    expect(sut(({ element }) => element`bravo`.mix`px-2`)).toBe(
      "alpha__bravo px-2",
    );
  });

  test("element with modifiers and a mix shorthand", () => {
    expect(sut(({ element }) => element`bravo ${{ charlie: true }} px-2`)).toBe(
      "alpha__bravo alpha__bravo--charlie px-2",
    );
  });
  test("element skipping modifiers but with a mix shorthand", () => {
    expect(sut(({ element }) => element`bravo ${null} px-2`)).toBe(
      "alpha__bravo px-2",
    );
  });

  test("automatically mixing with parent block casts to string", () => {
    const Child = withBem.named(
      "Child",
      function Child({ bem: { className } }) {
        return <div className={className} data-testid="component" />;
      },
    );

    const Parent = withBem.named(
      "Parent",
      function Parent({ bem: { className, element } }) {
        return (
          <div className={className}>
            <Child className={element`element`} />
          </div>
        );
      },
    );
    const { getByTestId } = render(<Parent />);
    const { className } = getByTestId("component");

    expect(className).toBe("child parent__element");
  });
});
