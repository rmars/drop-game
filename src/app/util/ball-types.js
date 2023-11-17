const massFactor = 1.293;
const defaultCategory = 0b0001; // for matterjs collisions

const ballOrder = ["one", "two", "three", "four", "five"];
const colors = ["#4D9DE0", "#E15554", "#E1BC29", "#3BB273", "#7768AE"];

// when dropping random balls, only drop smaller balls
const randomBalls = ballOrder.slice(0, -1);

// gets a random ball from the order (but not the largest balls);
export const getRandomBall = () => {
  return randomBalls[Math.round(Math.random() * 10) % randomBalls.length];
};

// returns the name of the next largest ball in the ball order
export const getNextBall = currBall => {
  if (currBall === ballOrder[ballOrder.length - 1]) {
    return currBall;
  }
  const currIdx = ballOrder.findIndex(el => el == currBall);
  if (currIdx === -1) {
    console.error("can't find ball in ball order: ", currBall);
    return null;
  }
  return ballOrder[currIdx + 1];
};

// returns a matter.js options object with one extra property (radius)
export const generateBallProps = ball => {
  const ballProps = ballTypes[ball];
  if (ballProps === null) {
    console.error("could not find ball props for: ", ball);
    return {};
  }

  return {
    mass: 10,
    restitution: 0.9,
    friction: 0.005,
    render: {
      fillStyle: ballProps.color,
    },
    collisionFilter: {
      category: ballProps.category,
    },
    label: ballProps.label,
    radius: ballProps.radius,
  };
};

export const largestBall = ballOrder[ballOrder.length - 1];

export const ballTypes = {
  one: {
    radius: 10,
    color: colors[0],
    label: "one",
    category: defaultCategory,
  },
  two: {
    radius: 20,
    color: colors[1],
    label: "two",
    category: defaultCategory,
  },
  three: {
    radius: 30,
    color: colors[2],
    label: "three",
    category: defaultCategory,
  },
  four: {
    radius: 40,
    color: colors[3],
    label: "four",
    category: defaultCategory,
  },
  five: {
    radius: 80,
    color: colors[4],
    label: "five",
    category: defaultCategory,
  },
};
