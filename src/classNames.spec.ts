import classNames from "./classNames";

describe("classNames", () => {
  test("gigo", () => {
    expect(classNames(null)).toBe("");
    expect(classNames(undefined)).toBe("");
    expect(classNames(false)).toBe("");
    expect(classNames({})).toBe("");
    expect(classNames("")).toBe("");
    expect(classNames([""])).toBe("");
    expect(classNames(["", false, undefined, {}])).toBe("");
  });

  test("simple", () => {
    expect(
      classNames("alpha", "", ["bravo", { charlie: true }], { delta: false }),
    ).toBe("alpha bravo charlie");
  });

  test("prefixed objects", () => {
    expect(classNames({ variant: "blue" })).toBe("variant-blue");
  });
});
