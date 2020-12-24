import React from "react";
import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";

import {Starships} from "../starships";
import {testData} from "./data.js"

let container = null;
beforeEach(() => {
  // setup a DOM element as a render target
  container = document.createElement("div");
  document.body.appendChild(container);
}); 

afterEach(() => {
  // cleanup on exiting
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});

it("downloads starship and pilot data", async () => {
  let returnData = testData;

  jest.spyOn(global, "fetch").mockImplementation(() =>
    Promise.resolve({
      json: () => Promise.resolve(returnData.shift())
    })
  );

  await act(async () => {
    render(<Starships />, container);
  });

  expect(container.querySelector("#starshipName")[1].value).toEqual(
    "CR90 corvette");
  expect(container.querySelector("#starshipName")[36].value).toEqual(
    "V-wing");

  // remove the mock to ensure tests are completely isolated  
  global.fetch.mockRestore();
});