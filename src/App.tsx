// import PokemonGuessGame from './components/teste';
// import PokemonCard from './components/pokemonCard';
import { useState } from 'react';
import EasyPokemonGame from './components/easyPokemonAllGame';
import PokemonFirstGame from './components/pokemonAllGame';
import SwitchComponent from './components/switchComponent';
import { Analytics } from '@vercel/analytics/react';

function App() {
  const [isEasyMode, setIsEasyMode] = useState<boolean>(true);
  const [startGame, setStartGame] = useState<boolean>(false);

  const handleSetEasyMode = () => {
    setIsEasyMode((oldState) => !oldState);
  };

  return (
    <section className="bg-[#1a1a1a] flex flex-col w-full">
      <Analytics />
      <h1 className="text-center text-white text-3xl font-bold py-4">Pokemon Game</h1>

      {!startGame ? (
        <>
          <button
            onClick={() => setStartGame(true)}
            className="bg-red-500 text-white font-bold py-2 px-4 rounded m-4"
          >
            Start Game
          </button>
          <SwitchComponent isMedium={!isEasyMode} onToggle={handleSetEasyMode} />
        </>
      ) : null}

      {startGame ? isEasyMode ? <EasyPokemonGame /> : <PokemonFirstGame /> : null}
    </section>
  );
}

export default App;
