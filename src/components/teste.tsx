import React, { useState, useEffect } from 'react';
import axios from 'axios';

const getRandomPokemonId = () => Math.floor(Math.random() * 898) + 1;

const PokemonGuessGame: React.FC = () => {
  const [pokemon, setPokemon] = useState<any>(null);
  const [evolutionChain, setEvolutionChain] = useState<any>(null);
  const [revealedData, setRevealedData] = useState<string[]>([]);
  const [attempts, setAttempts] = useState(0);
  const [guess, setGuess] = useState('');
  const [isCorrect, setIsCorrect] = useState(false);
  const [initialHints, setInitialHints] = useState<string[]>([]);
  const [noMoreHintsShown, setNoMoreHintsShown] = useState(false);

  useEffect(() => {
    const fetchPokemon = async () => {
      const pokemonId = getRandomPokemonId();
      const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`);
      const speciesResponse = await axios.get(response.data.species.url);
      const evolutionResponse = await axios.get(speciesResponse.data.evolution_chain.url);

      setEvolutionChain(evolutionResponse.data.chain);

      const baseStats = response.data.stats
        .filter((s: any) =>
          ['hp', 'attack', 'defense', 'special-attack', 'special-defense', 'speed'].includes(s.stat.name)
        )
        .map((s: any) => `${s.stat.name}: ${s.base_stat}`);

      const types = `Tipos: ${response.data.types.map((t: any) => t.type.name).join(', ')}`;
      const firstGame = `Geração: ${speciesResponse.data.generation.name}`;
      const { evolutionCount, currentStage } = getEvolutionInfo(
        evolutionResponse.data.chain,
        response.data.name
      );
      const evolutionInfo = `Evolução: Estágio ${currentStage} de ${evolutionCount}`;

      const hintsPool = [...baseStats, evolutionInfo, firstGame];

      setPokemon(response.data);
      setInitialHints([types, ...getRandomHints(hintsPool, 1)]);
    };
    fetchPokemon();
  }, []);

  const getEvolutionInfo = (chain: any, pokemonName: string) => {
    let evolutionCount = 1;
    let currentStage = 1;

    const traverseChain = (node: any, stage: number) => {
      if (node.species.name === pokemonName) {
        currentStage = stage;
      }
      if (node.evolves_to.length > 0) {
        evolutionCount = Math.max(evolutionCount, stage + 1);
        node.evolves_to.forEach((evol: any) => traverseChain(evol, stage + 1));
      }
    };

    traverseChain(chain, 1);
    return { evolutionCount, currentStage };
  };

  const getRandomHints = (hints: string[], count: number) => {
    const shuffled = [...hints].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  };

  const handleGuess = () => {
    if (!pokemon) return;
    setAttempts(attempts + 1);

    if (guess.toLowerCase() === pokemon.name.toLowerCase()) {
      setIsCorrect(true);
    } else {
      const newHint = getHint();
      if (newHint && newHint !== 'No more hints available.') {
        setRevealedData([...revealedData, newHint]);
      } else if (!noMoreHintsShown) {
        setRevealedData([...revealedData, 'No more hints available.']);
        setNoMoreHintsShown(true);
      }
    }
  };

  const getHint = () => {
    if (!pokemon || !evolutionChain) return '';
    const availableHints = new Set([...initialHints, ...revealedData]);
    const { currentStage, evolutionCount } = getEvolutionInfo(evolutionChain, pokemon.name);
    const possibleHints = [
      `Types: ${pokemon.types.map((t: any) => t.type.name).join(', ')}`,
      ...pokemon.stats.map((s: any) => `${s.stat.name}: ${s.base_stat}`),
      `Evolution: Stage ${currentStage} of ${evolutionCount}`,
    ].filter((hint) => !availableHints.has(hint));

    return possibleHints.length > 0 ? possibleHints[0] : 'No more hints available.';
  };

  return (
    <div className="p-4 text-center">
      <h1 className="text-2xl font-bold">Adivinhe o Pokémon!</h1>
      <p>Attempts: {attempts}/10</p>
      {initialHints.map((hint, index) => (
        <p key={index}>{hint}</p>
      ))}
      {revealedData.map((hint, index) => (
        <p key={index}>{hint}</p>
      ))}
      {!isCorrect && attempts < 10 && (
        <div>
          <input
            type="text"
            value={guess}
            onChange={(e) => setGuess(e.target.value)}
            className="border p-2"
          />
          <button
            onClick={handleGuess}
            onKeyDown={(e) => e.key === 'Enter' && handleGuess}
            className="ml-2 bg-blue-500 text-white px-4 py-2"
          >
            Guess
          </button>
        </div>
      )}
      {(isCorrect || attempts >= 10) && pokemon && (
        <div>
          <p>{isCorrect ? 'Correct!' : 'Out of attempts!'}</p>
          <img src={pokemon.sprites.front_default} alt={pokemon.name} />
          <p>{pokemon.name}</p>
        </div>
      )}
    </div>
  );
};

export default PokemonGuessGame;
