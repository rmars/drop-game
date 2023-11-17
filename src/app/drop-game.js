"use client";

import React, { useEffect, useRef, useState } from "react";
import { Engine, Render, World, Bodies, Events } from "matter-js";
import {
  getRandomBall,
  getNextBall,
  generateBallProps,
  largestBall,
} from "./util/ball-types.js";

const wallOptions = {
  isStatic: true,
  label: "walls",
  render: {
    fillStyle: "blue",
  },
};

function DropGame() {
  const boxRef = useRef(null);
  const canvasRef = useRef(null);
  const engine = useRef(Engine.create());
  const width = 300;
  const height = 600;
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
        background: "rgba(255, 0, 0, 0.5)",
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

    World.add(engine.current.world, [floor, right, left]);

    Engine.run(engine.current);
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

  const handleAddCircle = () => {
    const ballPr = generateBallProps(getRandomBall());
    console.log("adding", ballPr.label, ballPr.radius);
    World.add(engine.current.world, [
      Bodies.circle(150, 0, ballPr.radius, ballPr),
    ]);
  };

  return (
    <div
      onClick={handleAddCircle}
      ref={boxRef}
      style={{
        width,
        height,
      }}>
      <canvas ref={canvasRef} />
    </div>
  );
}

export default DropGame;
