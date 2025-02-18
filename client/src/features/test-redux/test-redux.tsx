import React from "react"
import { Counter } from "../counter/Counter"
import { Quotes } from "../quotes/Quotes"

import logo from "../../logo.svg"

export default function TestRedux() {
  return (
    <header className="App-header">
      <img src={logo} className="App-logo" alt="logo" />
      <Counter />
      <p>
        Edit <code>src/App.tsx</code> and save to reload.
      </p>
      <Quotes />
      <span>
        <span>Learn </span>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          React
        </a>
        <span>, </span>
        <a
          className="App-link"
          href="https://redux.js.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Redux
        </a>
        <span>, </span>
        <a
          className="App-link"
          href="https://redux-toolkit.js.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Redux Toolkit
        </a>
        <span>, </span>
        <a
          className="App-link"
          href="https://react-redux.js.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          React Redux
        </a>
        ,<span> and </span>
        <a
          className="App-link"
          href="https://reselect.js.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Reselect
        </a>
      </span>
    </header>
  )
}
