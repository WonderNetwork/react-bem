import React from "react";
import { withBem } from "./index";
import { describe, expect, test } from "@jest/globals";
import { toMatchJSX } from "./toMatchJSX";

expect.extend({
  toMatchJSX,
});

describe("showcase", () => {
  test("Simplest way to create a block with some elements", () => {
    const Acme = withBem.named(
      "Acme",
      function ({ bem: { className, element } }) {
        return (
          <div className={className}>
            <h1 className={element`heading`}>Hello</h1>
          </div>
        );
      },
    );

    expect(<Acme />).toMatchJSX(
      <div className="acme">
        <h1 className="acme__heading">Hello</h1>
      </div>,
    );
  });

  test("BEM helper as a shorthand if there are no elements", () => {
    const Acme = withBem.named("Acme", function ({ bem }) {
      return <div className={bem}>Hello</div>;
    });

    expect(<Acme />).toMatchJSX(<div className="acme">Hello</div>);
  });

  test("Adding block modifiers", () => {
    const Acme = withBem.named("Acme", function ({ bem: { block } }) {
      const [toggle, setToggle] = React.useState(true);
      const onClick = React.useCallback(
        () => setToggle((current) => !current),
        [setToggle],
      );

      return (
        <div className={block`${{ toggle }} always-enabled`}>
          <button onClick={onClick}>Toggle</button>
        </div>
      );
    });

    expect(<Acme />).toMatchJSX(
      <div className="acme acme--toggle acme--always-enabled">
        <button>Toggle</button>
      </div>,
    );
  });

  test("Mixing the block with other classes", () => {
    const Acme = withBem.named("Acme", function ({ bem: { block } }) {
      return <div className={block``.mix`me-2 d-flex`}></div>;
    });

    expect(<Acme />).toMatchJSX(<div className="acme me-2 d-flex" />);
  });

  test("Mixing with parent block", () => {
    const Child = withBem.named("Child", function Child({ bem: { block } }) {
      return <div className={block`${{ active: true }}`.mix`me-2`} />;
    });

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

    expect(<Parent />).toMatchJSX(
      <div className="parent">
        <div className="child parent__element child--active me-2" />
      </div>,
    );
  });

  test("Using elements with modifiers", () => {
    const Acme = withBem.named(
      "Acme",
      function ({ bem: { className, element } }: withBem.props) {
        return (
          <div className={className}>
            <div className={element`item ${{ selected: true }} me-2`} />
            <div className={element`item ${{ variant: "primary" }}`} />
            <div className={element`item ${["theme-dark"]}`} />
            <div className={element`item`.mix`d-flex`} />
          </div>
        );
      },
    );

    expect(<Acme />).toMatchJSX(
      <div className="acme">
        <div className="acme__item acme__item--selected me-2" />
        <div className="acme__item acme__item--variant-primary" />
        <div className="acme__item acme__item--theme-dark" />
        <div className="acme__item d-flex" />
      </div>,
    );
  });
});
