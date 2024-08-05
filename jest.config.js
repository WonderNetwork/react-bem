module.exports = {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  testMatch: ["**/*.spec.ts", "**/*.spec.tsx"],
  transform: {
    ".+": [
      "ts-jest",
      {
        diagnostics: {
          ignoreCodes: ["TS151001"],
        },
      },
    ],
  },
};
