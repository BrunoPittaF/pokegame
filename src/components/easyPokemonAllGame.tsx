import React, { useState, useEffect } from 'react';
import { pokemonList } from '../constants/pokemons';

const regions = [
  { name: 'Kanto', start: 0, end: 151 },
  { name: 'Johto', start: 151, end: 251 },
  { name: 'Hoenn', start: 251, end: 386 },
  { name: 'Sinnoh', start: 386, end: 493 },
  { name: 'Unova', start: 493, end: 649 },
  { name: 'Kalos', start: 649, end: 721 },
  { name: 'Alola', start: 721, end: 809 },
  { name: 'Galar', start: 809, end: 905 },
  { name: 'Paldea', start: 905, end: 1025 },
];

const EasyPokemonGame: React.FC = () => {
  const [controlRegion, setControlRegion] = useState([
    {
      name: 'Kanto',
      checked: true,
    },
    {
      name: 'Johto',
      checked: true,
    },
    {
      name: 'Hoenn',
      checked: true,
    },
    {
      name: 'Sinnoh',
      checked: true,
    },
    {
      name: 'Unova',
      checked: true,
    },
    {
      name: 'Kalos',
      checked: true,
    },
    {
      name: 'Alola',
      checked: true,
    },
    {
      name: 'Galar',
      checked: true,
    },
    {
      name: 'Paldea',
      checked: true,
    },
  ]);
  const [selectedRegions, setSelectedRegions] = useState<typeof regions>([]);
  const [guessed, setGuessed] = useState<{ [key: number]: boolean }>({});
  const [pokemonData, setPokemonData] = useState<{ [key: number]: any }>({});
  const [lastGuessed, setLastGuessed] = useState<any>(null);
  const [input, setInput] = useState('');
  const [timer, setTimer] = useState(0);
  const [gameFinished, setGameFinished] = useState(false);
  const [intervalId, setIntervalId] = useState<any>(null);
  const [surrender, setSurrender] = useState<boolean>(false);
  const [lastAccept, setLastAccept] = useState<{ [key: number]: boolean }>({});
  const [startedGame, setStartedGame] = useState<boolean>(false);
  const [pontuation, setPontuation] = useState<number>(0);
  const [record, setRecord] = useState<number>(
    localStorage.getItem('recordEasy') ? Number(localStorage.getItem('recordEasy')) : 0
  );

  const selectRegionsForGame = () => {
    const activeRegionNames = new Set(
      controlRegion.filter((region) => region.checked).map((region) => region.name)
    );
    const filteredRegions = regions.filter((region) => activeRegionNames.has(region.name));

    if (filteredRegions && filteredRegions.length > 0) {
      setSelectedRegions(filteredRegions);
    } else {
      setSelectedRegions(regions);
    }
  };

  useEffect(() => {
    if (!gameFinished && startedGame) {
      const id = setInterval(() => setTimer((t) => t + 1), 1000);
      setIntervalId(id);
      setRecord(pontuation > record ? pontuation : record);
      localStorage.setItem('record', pontuation > record ? pontuation.toString() : record.toString());
      return () => clearInterval(id);
    }
  }, [gameFinished, startedGame, pontuation, record]);

  useEffect(() => {}, []);

  const handleGuess = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && input.trim() !== '') {
      try {
        const lengthSelectedRegions = selectedRegions.length === 1 ? 0 : selectedRegions.length - 1;
        const pokemon = pokemonList.find((element) => {
          return (
            element.name.toLocaleLowerCase() === input.toLocaleLowerCase() &&
            element.id <= selectedRegions[lengthSelectedRegions].end &&
            element.id >= selectedRegions[0].start
          );
        });

        if (pokemon && !guessed[pokemon.id]) {
          setGuessed((prev) => ({ ...prev, [pokemon.id]: true }));
          setPokemonData((prev) => ({ ...prev, [pokemon.id]: pokemon, showName: true }));
          setLastGuessed(pokemon);
          setInput('');
          setPontuation((prev) => prev + 1);
        }

        if (Object.keys(guessed).length === selectedRegions[selectedRegions.length - 1].end) {
          clearInterval(intervalId);
          setGameFinished(true);
        }
      } catch {
        setInput('');
      }
    }
  };

  const handleGiveUp = async () => {
    clearInterval(intervalId);
    setGameFinished(true);
    setSurrender(true);
    setLastAccept(guessed);
    const allPokemonData: { [key: number]: any } = {};
    for (let i = 0; i <= 1025; i++) {
      try {
        allPokemonData[i] = pokemonList[i];
      } catch {
        console.error('caio');
      }
    }
    setGuessed(Object.fromEntries(Object.keys(allPokemonData).map((id) => [Number(id), true])));
    setPokemonData(allPokemonData);
  };

  return (
    <div className="p-4 max-sm:p-0 min-h-screen flex flex-col items-center m">
      <h2 className="text-3xl font-bold text-center text-white-800">Adivinhe os pokemons!</h2>
      <p>Melhor Partida: {record}</p>
      <p>Pontuação: {pontuation > record ? `Novo Recorde! ${pontuation} pontos` : record}</p>

      {selectedRegions.length === 0 && (
        <div className="flex flex-col mt-[6px]">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                name="Kanto"
                checked={controlRegion[0].checked}
                onChange={() =>
                  setControlRegion((oldState) =>
                    oldState.map((item) =>
                      item.name === 'Kanto' ? { ...item, checked: !item.checked } : item
                    )
                  )
                }
              />
              <label htmlFor="Kanto">Kanto</label>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                name="Johto"
                checked={controlRegion[1].checked}
                onChange={() =>
                  setControlRegion((oldState) =>
                    oldState.map((item) =>
                      item.name === 'Johto' ? { ...item, checked: !item.checked } : item
                    )
                  )
                }
              />
              <label htmlFor="Johto">Johto</label>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                name="Hoenn"
                checked={controlRegion[2].checked}
                onChange={() =>
                  setControlRegion((oldState) =>
                    oldState.map((item) =>
                      item.name === 'Hoenn' ? { ...item, checked: !item.checked } : item
                    )
                  )
                }
              />
              <label htmlFor="Hoenn">Hoenn</label>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                name="Sinnoh"
                checked={controlRegion[3].checked}
                onChange={() =>
                  setControlRegion((oldState) =>
                    oldState.map((item) =>
                      item.name === 'Sinnoh' ? { ...item, checked: !item.checked } : item
                    )
                  )
                }
              />
              <label htmlFor="Sinnoh">Sinnoh</label>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                name="Unova"
                checked={controlRegion[4].checked}
                onChange={() =>
                  setControlRegion((oldState) =>
                    oldState.map((item) =>
                      item.name === 'Unova' ? { ...item, checked: !item.checked } : item
                    )
                  )
                }
              />
              <label htmlFor="Unova">Unova</label>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                name="Kalos"
                checked={controlRegion[5].checked}
                onChange={() =>
                  setControlRegion((oldState) =>
                    oldState.map((item) =>
                      item.name === 'Kalos' ? { ...item, checked: !item.checked } : item
                    )
                  )
                }
              />
              <label htmlFor="Kalos">Kalos</label>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                name="Alola"
                checked={controlRegion[6].checked}
                onChange={() =>
                  setControlRegion((oldState) =>
                    oldState.map((item) =>
                      item.name === 'Alola' ? { ...item, checked: !item.checked } : item
                    )
                  )
                }
              />
              <label htmlFor="Alola">Alola</label>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                name="Galar"
                checked={controlRegion[7].checked}
                onChange={() =>
                  setControlRegion((oldState) =>
                    oldState.map((item) =>
                      item.name === 'Galar' ? { ...item, checked: !item.checked } : item
                    )
                  )
                }
              />
              <label htmlFor="Galar">Galar</label>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                name="Paldea"
                checked={controlRegion[8].checked}
                onChange={() =>
                  setControlRegion((oldState) =>
                    oldState.map((item) =>
                      item.name === 'Paldea' ? { ...item, checked: !item.checked } : item
                    )
                  )
                }
              />
              <label htmlFor="Paldea">Paldea</label>
            </div>
          </div>
          <button
            className="mt-4 text-white bg-green-700 rounded p-2 hover:bg-green-900 transition"
            onClick={selectRegionsForGame}
          >
            Confirmar Regiões
          </button>
        </div>
      )}
      {startedGame && (
        <div className="fixed bottom-0 w-full bg-black bg-opacity-80 flex flex-col items-center justify-center">
          <p className="text-center text-lg text-white-700">
            Acertos: {!surrender ? Object.keys(guessed).length : Object.keys(lastAccept).length} /
            {selectedRegions[selectedRegions.length - 1].end}
          </p>
          <p className="text-center text-lg text-white-700">Tempo: {timer}s</p>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleGuess}
            placeholder="Digite o nome do Pokémon"
            className="block text-white mx-auto p-2 border-white border rounded w-64 mt-4"
          />
          <button
            onClick={handleGiveUp}
            className="mt-4 text-white bg-red-700 rounded p-2 hover:bg-red-900 transition"
          >
            Sou noob, quero as respostas
          </button>
        </div>
      )}
      {lastGuessed && (
        <div className="text-center mt-4">
          <p className="font-bold text-white-700">Último acerto: {lastGuessed.name.toLocaleLowerCase()}</p>
          <img src={lastGuessed.imagePokemon} alt={lastGuessed.name} className="mx-auto" />
        </div>
      )}

      {!startedGame && selectedRegions.length !== 0 && (
        <button
          onClick={() => setStartedGame(true)}
          className="mt-4 text-white bg-green-700 rounded p-2 hover:bg-green-900 transition"
        >
          Iniciar jogo
        </button>
      )}
      {!startedGame && (
        <>
          <h2>Regras:</h2>
          <ul>
            <li className="text-center">
              Deve ser capaz de acertar todos os pokemons (exclue-se formas regionais, formas do
              futuro/passado ou qualquer outro tipo de redesigner)
            </li>
            <li className="text-center">
              O jogo NÃO tem pause. O objetivo é fazer com que veja o quão rápido consegue lembrar do máximo
              de pokemons possíveis, boa sorte &#128516;
            </li>
            <li className="text-center">Modo Fácil: As fotos estão visiveis ao usuário</li>
            <li className="text-center">Após digitar o nome do pokemon, basta apertar enter</li>
            <li className="text-center">Boa sorte!</li>
          </ul>
        </>
      )}
      <div className="w-full flex flex-wrap justify-center gap-6 mt-6">
        {selectedRegions.map((region) => (
          <div key={region.name} className="w-full p-4 border rounded shadow-lg bg-white">
            <h2 className="font-bold text-center text-blue-800">{region.name}</h2>
            <div className="w-full flex flex-wrap justify-center gap-2 max-w-fit mt-2">
              {Array.from({ length: region.end - region.start }, (_, i) => region.start + i).map((id) => (
                <div
                  key={id}
                  className="w-20 h-24 border flex flex-col items-center justify-center bg-gray-200 rounded p-1"
                  data-id={id}
                >
                  <img
                    src={pokemonList[id].imagePokemon}
                    alt={pokemonList[id]?.name || id.toString()}
                    className="w-16 h-16"
                  />

                  {guessed[id] ? (
                    <p className="text-xs font-bold text-center text-gray-900 mt-1">
                      {pokemonData[id]?.name.toLocaleLowerCase()}
                    </p>
                  ) : (
                    <p className="text-xs font-bold text-center text-gray-700 mt-1"></p>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EasyPokemonGame;
