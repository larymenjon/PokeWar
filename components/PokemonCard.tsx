import React from 'react';
import { Pokemon } from '../types';
import { TYPE_ADVANTAGES } from '../constants';

interface PokemonCardProps {
    pokemon: Pokemon | null;
    revealed: boolean;
    isPlayable?: boolean;
    onSelect?: () => void;
}

const typeColorMap: { [key: string]: string } = {
    Fire: 'bg-red-500 border-red-700',
    Water: 'bg-blue-500 border-blue-700',
    Grass: 'bg-green-500 border-green-700',
    Electric: 'bg-yellow-400 border-yellow-600',
    Psychic: 'bg-pink-500 border-pink-700',
    Normal: 'bg-gray-400 border-gray-600',
    Fighting: 'bg-orange-700 border-orange-900',
    Poison: 'bg-purple-600 border-purple-800',
    Ground: 'bg-yellow-600 border-yellow-800',
    Ghost: 'bg-indigo-700 border-indigo-900',
    Bug: 'bg-lime-500 border-lime-700',
    default: 'bg-gray-700 border-gray-900'
};

const CardBack: React.FC = () => (
    <div className="absolute w-full h-full backface-hidden bg-blue-600 rounded-xl border-4 border-yellow-400 flex items-center justify-center p-4">
        <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center">
            <div className="w-20 h-20 bg-red-600 rounded-full border-4 border-black flex items-center justify-center">
                <div className="w-8 h-8 bg-white rounded-full border-2 border-black"></div>
            </div>
        </div>
    </div>
);

const CardFront: React.FC<{ pokemon: Pokemon }> = ({ pokemon }) => {
    const colorClasses = typeColorMap[pokemon.type] || typeColorMap.default;
    const gradientClasses: { [key: string]: string } = {
        Fire: 'from-red-600 to-orange-400',
        Water: 'from-blue-600 to-cyan-400',
        Grass: 'from-green-600 to-lime-400',
        Electric: 'from-yellow-500 to-amber-300',
        Psychic: 'from-pink-600 to-purple-400',
        Normal: 'from-gray-500 to-slate-300',
        Fighting: 'from-orange-800 to-red-600',
        Poison: 'from-purple-700 to-fuchsia-500',
        Ground: 'from-yellow-700 to-amber-500',
        Ghost: 'from-indigo-800 to-purple-600',
        Bug: 'from-lime-600 to-green-400',
    };
    const bgGradient = gradientClasses[pokemon.type] || 'from-gray-700 to-gray-600';

    const getWeakness = (pokemonType: string): string => {
        for (const attacker in TYPE_ADVANTAGES) {
            if (TYPE_ADVANTAGES[attacker].includes(pokemonType)) {
                return attacker;
            }
        }
        return 'N/A';
    };

    const getResistance = (pokemonType: string): string => {
        return TYPE_ADVANTAGES[pokemonType]?.[0] || 'N/A';
    };

    const weakness = getWeakness(pokemon.type);
    const resistance = getResistance(pokemon.type);

    return (
        <div className={`absolute w-full h-full backface-hidden rotate-y-180 rounded-xl overflow-hidden shadow-lg border-[6px] border-yellow-300 flex flex-col bg-gradient-to-b ${bgGradient}`}>
            
            <div className="p-2 pb-1 bg-black/20">
                 <div className="flex justify-between items-baseline text-white">
                    <h3 className="text-base md:text-lg font-bold" style={{ textShadow: '1px 1px 3px black' }}>{pokemon.name}</h3>
                    <div className="text-right flex items-center gap-1">
                        <span className="text-xs font-bold text-yellow-200">HP</span>
                        <p className="text-xl font-black" style={{ textShadow: '1px 1px 3px black' }}>{pokemon.hp}</p>
                    </div>
                </div>
            </div>

            <div className="mx-2 my-1 h-32 bg-white/30 rounded-md shadow-inner border border-white/50 flex items-center justify-center p-1">
                <img src={pokemon.imageUrl} alt={pokemon.name} className="max-h-full max-w-full object-contain drop-shadow-[0_2px_2px_rgba(0,0,0,0.7)]" />
            </div>
            
            <div className="bg-slate-200 text-slate-900 mx-2 p-2 flex-grow flex flex-col justify-center border-t-2 border-b-2 border-yellow-300">
                <div className="flex justify-between items-center">
                    <h4 className="text-sm font-bold w-3/4">{pokemon.attackName}</h4>
                    <p className="text-2xl font-black text-red-600" style={{ textShadow: '1px 1px 1px white' }}>{pokemon.attack}</p>
                </div>
                <p className="text-xs italic pt-1 border-t border-slate-400/50 mt-1">{pokemon.description}</p>
            </div>

            <div className="bg-gray-300/80 text-gray-800 text-[10px] font-semibold p-1 mx-2 mb-1 rounded-b-lg flex justify-around text-center border-t border-gray-400">
                <div>
                    <span className="font-normal uppercase">Fraqueza</span>
                    <p>{weakness}</p>
                </div>
                <div>
                    <span className="font-normal uppercase">Resistência</span>
                    <p>{resistance}</p>
                </div>
                <div>
                    <span className="font-normal uppercase">Recuo</span>
                    <p>⭐️⭐️</p>
                </div>
            </div>

        </div>
    );
};


const PokemonCard: React.FC<PokemonCardProps> = ({ pokemon, revealed, isPlayable, onSelect }) => {
    const cardContainerClasses = `relative w-full h-full transform-style-3d transition-transform duration-700 ${revealed ? 'rotate-y-180' : ''}`;
    const wrapperClasses = `w-40 h-56 md:w-48 md:h-64 perspective ${isPlayable ? 'cursor-pointer hover:-translate-y-4 hover:scale-105 transition-transform duration-300' : ''}`;

    if (!pokemon && revealed) { 
        return <div className={`${wrapperClasses.split(' ')[0]} ${wrapperClasses.split(' ')[1]}`}><div className="w-full h-full bg-black bg-opacity-20 rounded-xl border-2 border-dashed border-slate-600"></div></div>;
    }

    return (
        <div className={wrapperClasses} onClick={isPlayable ? onSelect : undefined}>
            <div className={cardContainerClasses}>
                <CardBack />
                {pokemon && <CardFront pokemon={pokemon} />}
            </div>
        </div>
    );
};

export default PokemonCard;