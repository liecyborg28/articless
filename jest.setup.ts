/* eslint-disable @typescript-eslint/no-explicit-any */
// jest.setup.ts

// ✅ Polyfill structuredClone yang aman untuk undefined/null
if (typeof global.structuredClone === "undefined") {
  global.structuredClone = (obj: any) => {
    if (obj === undefined || obj === null) return obj;
    return JSON.parse(JSON.stringify(obj));
  };
}

// ✅ Import testing-library DOM matchers
import "@testing-library/jest-dom";
