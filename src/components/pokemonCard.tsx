import React, { useState, useEffect } from 'react';
import axios from 'axios';

const getRandomPokemonId = () => Math.floor(Math.random() * 898) + 1;

const typeColors: Record<string, string> = {
  normal: 'bg-gray-400',
  fire: 'bg-red-500',
  water: 'bg-blue-600',
  grass: 'bg-green-500',
  electric: 'bg-yellow-400',
  ice: 'bg-blue-300',
  fighting: 'bg-red-700',
  poison: 'bg-purple-500',
  ground: 'bg-yellow-700',
  flying: 'bg-indigo-400',
  psychic: 'bg-pink-500',
  bug: 'bg-green-700',
  rock: 'bg-yellow-800',
  ghost: 'bg-purple-700',
  dragon: 'bg-indigo-700',
  dark: 'bg-gray-700',
  steel: 'bg-gray-500',
  fairy: 'bg-pink-300',
};

const PokemonCard: React.FC = () => {
  const [originalPokemon, setOriginalPokemon] = useState<any>(null);
  const [displayPokemon, setDisplayPokemon] = useState<any>(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchPokemon = async () => {
      const pokemonId = getRandomPokemonId();
      const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`);
      setOriginalPokemon(response.data);
      setDisplayPokemon(response.data);
    };
    fetchPokemon();
  }, []);

  const handleSearch = async () => {
    if (!search.trim()) {
      setDisplayPokemon(originalPokemon);
      return;
    }
    try {
      const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${search.toLowerCase()}`);
      setDisplayPokemon(response.data);
    } catch (error: any) {
      console.error(error);
      setDisplayPokemon(originalPokemon);
    }
  };

  return (
    <div>
      <div className="absolute top-4 right-4 p-4 bg-[#141414] rounded-lg shadow-lg w-64">
        <input
          type="text"
          placeholder="Buscar Pokémon"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full p-2 mb-2 rounded text-black"
        />
        <button onClick={handleSearch} className="w-full bg-blue-500 text-white p-2 rounded mb-2">
          Buscar
        </button>
        {displayPokemon && (
          <>
            <h2 className="text-white text-center text-lg font-bold">Pokémon</h2>
            <img src={displayPokemon.sprites.front_default} alt={displayPokemon.name} className="mx-auto" />
            <div className="flex flex-wrap gap-2 justify-center mt-2">
              {displayPokemon.types.map((t: any) => (
                <span key={t.type.name} className={`px-2 py-1 text-white rounded ${typeColors[t.type.name]}`}>
                  {t.type.name.toUpperCase()}
                </span>
              ))}
            </div>
            <div className="mt-2">
              {displayPokemon.stats.map((s: any) => (
                <div key={s.stat.name} className="text-white">
                  <span>{s.stat.name.toUpperCase()}: </span>
                  <div className="h-4 w-full bg-gray-300 rounded relative">
                    <span className="z-999 -top-0.5 left-2 text-sm absolute">{s.base_stat}</span>
                    <div
                      className="h-4 bg-green-500 rounded absolute"
                      style={{ width: `${s.base_stat}px` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PokemonCard;
