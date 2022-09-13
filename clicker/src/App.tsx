import React, { useEffect, useState } from "react";
import clickersJson from "../json/clickers.json";
import MyClickers from "../components/MyClickers";
import clicker from '../models/Clicker';

function App() {
  const [clicks, setClicks] = useState<number>(0);
  const [clickers, setClickers] = useState<clicker[]>(clickersJson as clicker[]);
  const [myClickers, setMyClickers] = useState<clicker[]>([]);
  const [clickValue, setClickValue] = useState<number>(1);
  const [cps, setCps] = useState<number>(0);
  const [buyMultiplier, setBuyMultiplier] = useState<number>(1);

  const multipliers = [
    { label: "x1", value: 1 },
    { label: "x5", value: 5 },
    { label: "x10", value: 10 },
    { label: "x100", value: 100 },
    { label: "x1000", value: 1000 },
  ];

  function click(): void {
    setClicks((old) => old + clickValue);
  }

  function buyClicker(newClicker: clicker): void {
    const totalCost = newClicker.cost * buyMultiplier
    if (clicks < totalCost) return;
    setClicks((old) => old - totalCost);
    const existingClickerIndex = myClickers.findIndex(
      (c) => c.id === newClicker.id
    );
    if (myClickers.findIndex((c) => c.id === newClicker.id) === -1)
      setMyClickers((old) => {
        newClicker.quantity = buyMultiplier;
        const newMyClicker = [...old, newClicker];
        setCps(
          newMyClicker
            .map((c) => c.clickValue * c.quantity)
            .reduce((a, b) => a + b)
        );
        return newMyClicker;
      });
    else {
      setMyClickers((old) => {
        const newMyClicker = [...old];
        newMyClicker[existingClickerIndex] = {
          ...newMyClicker[existingClickerIndex],
          quantity: newMyClicker[existingClickerIndex].quantity + buyMultiplier,
        };
        setCps(
          newMyClicker
            .map((c) => c.clickValue * c.quantity)
            .reduce((a, b) => a + b)
        );
        return newMyClicker;
      });
    }
  }

  function step(): void {
    if (myClickers.length <= 0) return;
    setClicks((clicks) => {
      return clicks + cps;
    });
  }

  useEffect(() => {
    const interval = setInterval(() => {
      step();
    }, 1000);

    return () => clearInterval(interval); // This represents the unmount function, in which you need to clear your interval to prevent memory leaks.
  }, [myClickers, cps]);

  return (
    <div className="p-[2rem] w-full flex flex-col align-middle content-center justify-center items-center">
      
      {/* HEADER */}
      <div className="mt-[3rem]">
        <h1 className="text-[24px] text-center font-semibold">Clicker Game</h1>
        <h3 className="mt-10 text-[38px] text-center font-semibold">
          {clicks}
        </h3>
      </div>

      {/* CLICK BUTTON */}
      <div className="flex mt-[3rem]">
        <button
          onClick={click}
          className="mx-auto py-3 px-5 rounded-lg bg-gray-100 text-zinc-900 active:scale-95 transition-all"
        >
          click
        </button>
      </div>

      {/* INVENTORY */}
      <MyClickers myClickers={myClickers} cps={cps}></MyClickers>

      {/* STORE */}
      <div className="flex mt-[2rem] flex-col w-[90%]">
        <h3>store</h3>

        {/* MULTIPLIERS */}
        <div className="mt-[1rem] flex space-x-[0.5rem] ">
          {multipliers.map((m, k) => (
            <button
              onClick={() => setBuyMultiplier(m.value)}
              key={k}
              className={`flex flex-wrap py-3 px-5 rounded-lg ${
                buyMultiplier !== m.value
                  ? "bg-gray-500 text-zinc-700 active:scale-95 hover:bg-gray-300"
                  : "bg-gray-100 active:scale-95 text-zinc-900 "
              } transition-all`}
            >
              {m.label}
            </button>
          ))}
        </div>

        {/* CLICKERS */}
        <div className="mt-[1rem] flex flex-wrap">
          {clickers.map((clicker, key) => (
            <button
              key={key}
              onClick={() => buyClicker(clicker)}
              className={`flex flex-wrap w-[10rem] h-[5rem] mr-[0.5rem] mb-[0.5rem] py-3 px-5 rounded-lg ${
                clicks < clicker.cost * buyMultiplier
                  ? "bg-gray-500 text-zinc-700"
                  : "bg-green-200 active:scale-95 text-green-900 "
              } transition-all`}
            >
              {clicker.name} ${clicker.cost}
            </button>
          ))}
        </div>

      </div>
    </div>
  );
}

export default App;
