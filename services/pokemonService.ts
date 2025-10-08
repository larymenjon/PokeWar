import { Pokemon } from '../types';

const POKEMON_DATA: Omit<Pokemon, 'id'>[] = [
    { name: 'Mewtwo', type: 'Psychic', attack: 100, hp: 100, imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/150.png', attackName: 'Psycho Cut', description: 'Uma poderosa lâmina psíquica corta o oponente.' },
    { name: 'Charizard', type: 'Fire', attack: 95, hp: 90, imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/6.png', attackName: 'Inferno Blast', description: 'Uma explosão de fogo escaldante envolve o inimigo.' },
    { name: 'Blastoise', type: 'Water', attack: 90, hp: 95, imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/9.png', attackName: 'Hydro Pump', description: 'Um canhão de água de alta pressão atinge o alvo.' },
    { name: 'Venusaur', type: 'Grass', attack: 88, hp: 98, imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/3.png', attackName: 'Solar Beam', description: 'Reúne luz e depois dispara um feixe poderoso.' },
    { name: 'Gengar', type: 'Ghost', attack: 85, hp: 80, imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/94.png', attackName: 'Shadow Ball', description: 'Lança uma bolha sombria que pode diminuir a Def. Esp.' },
    { name: 'Arcanine', type: 'Fire', attack: 82, hp: 85, imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/59.png', attackName: 'Flare Blitz', description: 'Uma carga envolta em fogo que também causa dano ao usuário.' },
    { name: 'Machamp', type: 'Fighting', attack: 80, hp: 90, imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/68.png', attackName: 'Cross Chop', description: 'Um golpe com as duas mãos com alta chance de acerto crítico.' },
    { name: 'Gyarados', type: 'Water', attack: 78, hp: 92, imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/130.png', attackName: 'Aqua Tail', description: 'O usuário ataca balançando sua cauda como uma onda violenta.' },
    { name: 'Snorlax', type: 'Normal', attack: 75, hp: 120, imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/143.png', attackName: 'Body Slam', description: 'Um golpe de corpo inteiro que pode causar paralisia.' },
    { name: 'Pikachu', type: 'Electric', attack: 70, hp: 60, imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png', attackName: 'Thunderbolt', description: 'Uma forte descarga elétrica é lançada no alvo.' },
    { name: 'Alakazam', type: 'Psychic', attack: 68, hp: 70, imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/65.png', attackName: 'Psychic', description: 'Um poderoso ataque psíquico que pode diminuir a Def. Esp.' },
    { name: 'Sandslash', type: 'Ground', attack: 65, hp: 75, imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/28.png', attackName: 'Earthquake', description: 'Um poderoso ataque que abala o chão contra todos.' },
    { name: 'Nidoking', type: 'Poison', attack: 62, hp: 81, imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/34.png', attackName: 'Poison Jab', description: 'Um ataque perfurante com uma ponta venenosa.' },
    { name: 'Jolteon', type: 'Electric', attack: 60, hp: 65, imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/135.png', attackName: 'Pin Missile', description: 'Pinos afiados são disparados sequencialmente no alvo.' },
    { name: 'Scyther', type: 'Bug', attack: 55, hp: 70, imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/123.png', attackName: 'Wing Attack', description: 'Ataca o alvo com as asas bem abertas.' },
    { name: 'Jigglypuff', type: 'Normal', attack: 40, hp: 115, imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/39.png', attackName: 'Sing', description: 'Uma canção suave que faz o inimigo adormecer.' },
    { name: 'Meowth', type: 'Normal', attack: 35, hp: 40, imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/52.png', attackName: 'Pay Day', description: 'Joga moedas no inimigo. Dinheiro é ganho após a batalha.' },
    { name: 'Psyduck', type: 'Water', attack: 30, hp: 50, imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/54.png', attackName: 'Water Gun', description: 'Esguicha água para atacar o oponente.' },
    { name: 'Caterpie', type: 'Bug', attack: 20, hp: 45, imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10.png', attackName: 'String Shot', description: 'Prende o inimigo com um fio para reduzir sua Velocidade.' },
    { name: 'Magikarp', type: 'Water', attack: 10, hp: 20, imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/129.png', attackName: 'Splash', description: 'É o ataque fútil definitivo.' },
];

export const getPokemonDeck = (): Pokemon[] => {
    const deckWithIds = POKEMON_DATA.map((p, index) => ({ ...p, id: index }));
    
    // Fisher-Yates shuffle algorithm
    for (let i = deckWithIds.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deckWithIds[i], deckWithIds[j]] = [deckWithIds[j], deckWithIds[i]];
    }
    
    return deckWithIds;
};