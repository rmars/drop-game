"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { Engine, Render, World, Bodies, Events, Runner } from "matter-js";
import styles from "./page.module.css";
import {
  getRandomBall,
  getNextBall,
  generateBallProps,
  largestBall,
} from "./util/ball-types.js";

// game colors
const colors = {
  background: "#E7D9CD",
  walls: "#C1A68E",
};

const wallOptions = {
  isStatic: true,
  label: "walls",
  render: {
    fillStyle: colors.walls,
  },
};

// canvas dimensions for the game
const width = 300;
const height = 600;

function DropGame() {
  const boxRef = useRef(null);
  const canvasRef = useRef(null);
  const engine = useRef(Engine.create());
  const [currentBall, setCurrentBall] = useState();

  // if ball 1 and ball 2 collide, we get a (1, 2) as well as a (2, 1) collision
  // event. track resolved collisions so we don't create duplicate balls if two
  // of the same color collide.
  const collisionMap = {};

  useEffect(() => {
    let render = Render.create({
      element: boxRef.current,
      engine: engine.current,
      canvas: canvasRef.current,
      options: {
        width,
        height,
        background: colors.background,
        wireframes: false,
      },
    });

    const floor = Bodies.rectangle(width / 2, height, height, 20, wallOptions);
    const right = Bodies.rectangle(
      width - 5,
      height / 2,
      10,
      height,
      wallOptions
    );
    const left = Bodies.rectangle(5, height / 2, 10, height, wallOptions);

    setCurrentBall(generateBallProps(getRandomBall()));

    World.add(engine.current.world, [floor, right, left]);

    Runner.run(engine.current);
    Render.run(render);

    Events.on(engine.current, "collisionStart", e => {
      if (e.pairs.length > 0) {
        const pair = e.pairs[0];

        // if either one is the largest ball, do nothing
        if (
          pair.bodyA.label === largestBall ||
          pair.bodyB.label === largestBall
        ) {
          return;
        }

        // if two balls of the same color collide, replace them with one ball of
        // the next largest size
        if (pair.bodyA.label === pair.bodyB.label) {
          World.remove(engine.current.world, [pair.bodyA, pair.bodyB]);
          const next = getNextBall(pair.bodyA.label);
          if (next === null) {
            return;
          }

          if (!collisionMap[pair.bodyA.id]) {
            const nextBall = generateBallProps(next);
            const ball = Bodies.circle(
              pair.collision.supports[0].x,
              pair.collision.supports[0].y,
              nextBall.radius,
              nextBall
            );
            World.add(engine.current.world, [ball]);
            collisionMap[pair.bodyA.id] = true;
            collisionMap[pair.bodyB.id] = true;
          }
        }
      }
    });
  }, []);

  const handleClick = useCallback(
    e => {
      var rect = e.target.getBoundingClientRect();
      const ballX = e.clientX - rect.left; // x position within the element

      setCurrentBall(generateBallProps(getRandomBall()));
      const nextBall = Bodies.circle(
        ballX,
        10,
        currentBall.radius,
        currentBall
      );
      World.add(engine.current.world, [nextBall]);
    },
    [currentBall, setCurrentBall]
  );

  return (
    <>
      <div className={styles.next}>
        {currentBall && (
          <span
            style={{
              alignSelf: "flex-end",
              height: currentBall.radius * 2,
              width: currentBall.radius * 2,
              backgroundColor: currentBall.render.fillStyle,
              borderRadius: "50%",
              display: "inline-block",
            }}></span>
        )}
      </div>
      <div
        onClick={handleClick}
        ref={boxRef}
        style={{
          width,
          height,
        }}>
        <canvas ref={canvasRef} />
      </div>
    </>
  );
}

export default DropGame;
