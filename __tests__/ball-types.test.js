import {
  ballOrder,
  getRandomBall,
  getNextBall,
  generateBallProps,
  largestBall,
} from "src/app/util/ball-types.js";
import "@testing-library/jest-dom";

describe("getNextBall", () => {
  it("returns the next ball in the ball order", () => {
    expect(getNextBall("one")).toBe("two");
    expect(getNextBall("two")).toBe("three");
    expect(getNextBall("four")).toBe("five");
  });
});

describe("generateBallProps", () => {
  it("returns the properties of a given ball, formatted for matterjs", () => {
    const props = generateBallProps("one");
    expect(props.mass).not.toBeNull();
    expect(props.radius).toBeGreaterThan(0);
    expect(props.friction).toBeGreaterThan(0);
    expect(props.label).toBeDefined();

    expect(() => generateBallProps("invalid")).toThrow();
  });
});

describe("largestBall", () => {
  it("returns the largest (last) ball order", () => {
    expect(largestBall).toBe("five");
  });
});

describe("getRandomBall", () => {
  it("returns a ball from the ball order", () => {
    expect(ballOrder).toContain(getRandomBall());
  });
});
