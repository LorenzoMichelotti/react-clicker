import React from "react";
import clicker from '../models/Clicker';

export default function MyClickers({myClickers, cps}: {myClickers: clicker[], cps: number}) {
    return (
        <div className="flex mt-[3rem] flex-col w-[90%]">
        <div className="flex">
          <h3>my clickers</h3>
          <legend className="ml-3 text-gray-400">cps {cps}</legend>
        </div>
        <div className="mt-[1rem] flex flex-wrap">
          {myClickers.sort((a, b) => a.id - b.id).map((clicker, key) => (
            <button
              key={key}
              className="flex flex-wrap w-[10rem] h-[5rem] mr-[0.5rem] mb-[0.5rem] py-3 px-5 rounded-lg bg-gray-100 text-zinc-900 cursor-default transition-all"
            >
              {clicker.name} x{clicker.quantity}
            </button>
          ))}
        </div>
        </div>
    )
}