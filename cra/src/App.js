import React, { useState, useContext } from 'react';
import classnames from 'classnames';
import './App.css';
import { makeLevel, getIndex } from './make-level';

const LevelContext = React.createContext();

function Column({ x, y, value }) {
  const level = useContext(LevelContext);
  const listIndex = getIndex({ x, y }, level.width);
  const matchLength = level.matchCounts[listIndex];
  return (
      <td className={classnames({ "match": matchLength > 1 }, `block-${value}`, "cell")}>
        {matchLength > 1 ? `${value}(${matchLength})` : `${value}(0)`}
      </td>
  );
}

function Row({ columns, y }) {
  const level = useContext(LevelContext);
  return (
      <tr key={y}>
        {columns.map((column, x) => {
          const listIndex = getIndex({ x, y }, level.width);
          return (<Column key={listIndex} x={x} y={y} value={column} />)
        })}
      </tr>
  );
}

function Level() {
  const level = useContext(LevelContext);
  return (
    <table>
      <tbody>
        {level.matrix.map((row, y) => {
          return (
              <Row key={y} columns={row} y={y} />
          );
        })}
      </tbody>
    </table>
  );
}
function App() {
  const [level, setLevel] = useState(makeLevel());
  return (
    <LevelContext.Provider value={level}>
      <div className="App">
        <Level />
        <button onClick={() => { setLevel(makeLevel()); }}>Reload</button>
      </div>
    </LevelContext.Provider>
  );
}

export default App;
