import './App.css';
import ModelContextBanner from './components/ModelContextBanner/ModelContextBanner';
import Referee from './components/Referee/Referee';

function App() {
  return (
    <>
      <ModelContextBanner />
      <div id="app">
        <Referee/>
      </div>
    </>
  );
}

export default App;
