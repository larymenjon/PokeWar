export const WINNING_SCORE = 10;
export const HAND_SIZE = 5;

export const TYPE_ADVANTAGES: { [key: string]: string[] } = {
    Fire: ['Grass', 'Bug'],
    Water: ['Fire', 'Ground'],
    Grass: ['Water', 'Ground'],
    Electric: ['Water'],
    Psychic: ['Fighting', 'Poison'],
    Fighting: ['Normal'],
    Ground: ['Electric', 'Fire', 'Poison'],
    Ghost: ['Psychic', 'Ghost'],
    Bug: ['Grass', 'Psychic'],
    Poison: ['Grass'],
    Normal: [],
};
