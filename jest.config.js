module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  collectCoverageFrom: ["src/module/micro-mqtt.ts"],
  testPathIgnorePatterns: ["node_modules", "bin"]
};
