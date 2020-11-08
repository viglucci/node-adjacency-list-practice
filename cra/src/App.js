import { useState } from 'react';
import classnames from 'classnames';
import './App.css';
import { makeLevel, getIndex } from './make-level';

function Column({ x, y, value, level }) {
  const listIndex = getIndex({ x, y }, level.width);
  const matchLength = level.matchCounts[listIndex];
  return (
      <td className={classnames({ "match": matchLength > 1 }, `block-${value}`, "cell")}>
        {matchLength > 1 ? `${value}(${matchLength})` : `${value}(0)`}
      </td>
  );
}

function Row({ columns, y, level }) {
  return (
      <tr key={y}>
        {columns.map((column, x) => {
          const listIndex = getIndex({ x, y }, level.width);
          return (<Column key={listIndex} x={x} y={y} value={column} level={level} />)
        })}
      </tr>
  );
}

function Level({ level }) {
  return (
    <table>
      <tbody>
        {level.matrix.map((row, y) => {
          return (
              <Row key={y} columns={row} y={y} level={level} />
          );
        })}
      </tbody>
    </table>
  );
}
function App() {
  const [level, setLevel] = useState(makeLevel());
  return (
    <div className="App">
      <Level level={level} />
      <button onClick={() => { setLevel(makeLevel()); }}>Reload</button>
    </div>
  );
}

export default App;
