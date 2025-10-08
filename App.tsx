import React, { useState, useEffect, useCallback } from 'react';
import { Pokemon } from './types';
import { getPokemonDeck } from './services/pokemonService';
import { WINNING_SCORE, TYPE_ADVANTAGES, HAND_SIZE } from './constants';
import PokemonCard from './components/PokemonCard';
import { soundService } from './services/soundService';

type GameState = 'START' | 'CHOOSE' | 'REVEAL' | 'RESULT' | 'GAME_OVER';
type RoundWinner = 'PLAYER' | 'AI' | 'TIE' | null;

const App: React.FC = () => {
    const [playerDeck, setPlayerDeck] = useState<Pokemon[]>([]);
    const [aiDeck, setAiDeck] = useState<Pokemon[]>([]);
    const [playerHand, setPlayerHand] = useState<Pokemon[]>([]);
    const [aiHand, setAiHand] = useState<Pokemon[]>([]);
    const [playerCard, setPlayerCard] = useState<Pokemon | null>(null);
    const [aiCard, setAiCard] = useState<Pokemon | null>(null);
    const [playerScore, setPlayerScore] = useState(0);
    const [aiScore, setAiScore] = useState(0);
    const [status, setStatus] = useState('Comece o jogo!');
    const [gameState, setGameState] = useState<GameState>('START');
    const [aiCardRevealed, setAiCardRevealed] = useState(false);
    const [playerName, setPlayerName] = useState('');
    const [tempPlayerName, setTempPlayerName] = useState('');
    const [isPlayerTurn, setIsPlayerTurn] = useState(true);
    const [roundWinner, setRoundWinner] = useState<RoundWinner>(null);


    const setupGame = useCallback(() => {
        const fullDeck = getPokemonDeck();
        const half = Math.ceil(fullDeck.length / 2);
        
        const initialPlayerDeck = fullDeck.slice(0, half);
        const initialAiDeck = fullDeck.slice(half);

        setPlayerHand(initialPlayerDeck.slice(0, HAND_SIZE));
        setAiHand(initialAiDeck.slice(0, HAND_SIZE));
        setPlayerDeck(initialPlayerDeck.slice(HAND_SIZE));
        setAiDeck(initialAiDeck.slice(HAND_SIZE));
        
        setPlayerCard(null);
        setAiCard(null);
        setPlayerScore(0);
        setAiScore(0);
        
        const firstTurnPlayer = Math.random() < 0.5;
        setIsPlayerTurn(firstTurnPlayer);
        setStatus(firstTurnPlayer ? 'Você começa! Escolha uma carta.' : 'A IA começa. Aguarde...');

        setGameState('CHOOSE');
        setAiCardRevealed(false);
        setRoundWinner(null);
    }, []);
    
    // Effect to handle AI's turn when it plays first
    useEffect(() => {
        if (gameState === 'CHOOSE' && !isPlayerTurn) {
            setStatus('A IA está pensando...');
            setTimeout(() => {
                const sortedHand = [...aiHand].sort((a, b) => a.attack - b.attack);
                const aiCardToPlay = sortedHand[Math.floor(sortedHand.length / 2)];
                
                setAiCard(aiCardToPlay);
                setAiHand(prev => prev.filter(card => card.id !== aiCardToPlay.id));
                setAiCardRevealed(true);
                setStatus('A IA jogou! Sua vez de responder.');
            }, 2000);
        }
    }, [gameState, isPlayerTurn, aiHand]);


    const handleGameStart = () => {
        if (tempPlayerName.trim()) {
            soundService.playClick();
            setPlayerName(tempPlayerName.trim());
            setupGame();
        }
    };

    const resolveBattle = (playerC: Pokemon, aiC: Pokemon) => {
        setGameState('REVEAL');
        setStatus('Batalha!');

        setTimeout(() => {
            if (isPlayerTurn) { // Only reveal AI card if player went first
                setAiCardRevealed(true);
            }
            setStatus('Comparando poderes...');
        }, 500);

        setTimeout(() => {
            let newPlayerScore = playerScore;
            let newAiScore = aiScore;
            let roundMessage = "";
            let winner: RoundWinner = 'TIE';

            const playerHasAdvantage = TYPE_ADVANTAGES[playerC.type]?.includes(aiC.type);
            const aiHasAdvantage = TYPE_ADVANTAGES[aiC.type]?.includes(playerC.type);

            if (playerC.attack > aiC.attack) {
                newPlayerScore++;
                roundMessage = 'Você venceu esta rodada!';
                soundService.playWin();
                winner = 'PLAYER';
                if (playerHasAdvantage) {
                    newPlayerScore++;
                    roundMessage = 'Você venceu com um bônus de vantagem de tipo! (+2)';
                }
            } else if (aiC.attack > playerC.attack) {
                newAiScore++;
                roundMessage = 'A IA venceu esta rodada!';
                soundService.playLose();
                winner = 'AI';
                if (aiHasAdvantage) {
                    newAiScore++;
                    roundMessage = 'A IA venceu com um bônus de vantagem de tipo! (+2)';
                }
            } else { // Attack tie
                if (playerHasAdvantage && !aiHasAdvantage) {
                    newPlayerScore++;
                    roundMessage = 'Empate no ataque! Você venceu com a vantagem de tipo!';
                    soundService.playWin();
                    winner = 'PLAYER';
                } else if (aiHasAdvantage && !playerHasAdvantage) {
                    newAiScore++;
                    roundMessage = 'Empate no ataque! A IA venceu com a vantagem de tipo!';
                    soundService.playLose();
                    winner = 'AI';
                } else {
                    roundMessage = "É uma rodada de empate!";
                    winner = 'TIE';
                }
            }
            
            setPlayerScore(newPlayerScore);
            setAiScore(newAiScore);
            setStatus(roundMessage);
            setGameState('RESULT');
            setRoundWinner(winner);

            if (newPlayerScore >= WINNING_SCORE) {
                setStatus(`Parabéns ${playerName}! Você ganhou o jogo!`);
                setGameState('GAME_OVER');
            } else if (newAiScore >= WINNING_SCORE) {
                setStatus('A IA ganhou o jogo! Mais sorte na próxima vez.');
                setGameState('GAME_OVER');
            }
        }, 2000);
    }

    const handleCardPlay = (selectedPlayerCard: Pokemon) => {
        if (gameState !== 'CHOOSE' || (isPlayerTurn && playerCard) || (!isPlayerTurn && !aiCard)) return;
        
        soundService.playCard();
        setPlayerCard(selectedPlayerCard);
        setPlayerHand(prev => prev.filter(card => card.id !== selectedPlayerCard.id));

        let chosenAiCard = aiCard; 

        // If player played first, AI needs to react
        if (isPlayerTurn) {
            const winningCards = aiHand.filter(card => card.attack > selectedPlayerCard.attack);
            if (winningCards.length > 0) {
                chosenAiCard = winningCards.reduce((prev, curr) => prev.attack < curr.attack ? prev : curr);
            } else {
                chosenAiCard = aiHand.reduce((prev, curr) => prev.attack < curr.attack ? prev : curr);
            }
            setAiCard(chosenAiCard);
            setAiHand(prev => prev.filter(card => card.id !== chosenAiCard!.id));
        }
        
        resolveBattle(selectedPlayerCard, chosenAiCard!);
    };

    const handleNextRound = () => {
        soundService.playClick();
        if ((playerHand.length === 0 && playerDeck.length === 0) || (aiHand.length === 0 && aiDeck.length === 0)) {
             let finalMessage = "Não há mais cartas!";
             if(playerScore > aiScore) finalMessage += ` Você venceu, ${playerName}!`;
             else if (aiScore > playerScore) finalMessage += " A IA venceu!";
             else finalMessage += " É um empate!";
             setStatus(finalMessage);
             setGameState('GAME_OVER');
             return;
        }

        const newPlayerHand = [...playerHand];
        const newPlayerDeck = [...playerDeck];
        if(newPlayerDeck.length > 0) {
            newPlayerHand.push(newPlayerDeck[0]);
            newPlayerDeck.shift();
        }

        const newAiHand = [...aiHand];
        const newAiDeck = [...aiDeck];
        if(newAiDeck.length > 0) {
            newAiHand.push(newAiDeck[0]);
            newAiDeck.shift();
        }
        
        setPlayerHand(newPlayerHand);
        setPlayerDeck(newPlayerDeck);
        setAiHand(newAiHand);
        setAiDeck(newAiDeck);

        setPlayerCard(null);
        setAiCard(null);
        setAiCardRevealed(false);

        // Loser of the round goes first in the next round
        let nextTurnPlayer = isPlayerTurn;
        if (roundWinner === 'PLAYER') nextTurnPlayer = false; // AI's turn
        else if (roundWinner === 'AI') nextTurnPlayer = true; // Player's turn
        // On tie, the turn initiator remains the same

        setIsPlayerTurn(nextTurnPlayer);
        setStatus(nextTurnPlayer ? 'Sua vez de jogar!' : 'Vez da IA...');
        setGameState('CHOOSE');
        setRoundWinner(null);
    }
    
    const handleResetGame = () => {
        soundService.playClick();
        setGameState('START');
        setTempPlayerName('');
        setPlayerName('');
    }

    const isGameOver = gameState === 'GAME_OVER';
    
    if (gameState === 'START') {
        return (
             <div className="bg-slate-900 text-white min-h-screen flex flex-col items-center justify-center p-4 font-sans bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
                <div className="text-center bg-black bg-opacity-40 p-10 rounded-xl shadow-2xl border border-slate-700">
                    <h1 className="text-6xl font-bold text-yellow-400 mb-4" style={{ textShadow: '3px 3px 6px #000000' }}>
                        PokeWar
                    </h1>
                    <p className="text-slate-300 mb-8 text-lg">Digite seu nome para começar a batalha!</p>
                    <input 
                        type="text"
                        value={tempPlayerName}
                        onChange={(e) => setTempPlayerName(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleGameStart()}
                        placeholder="Seu Nome"
                        className="w-full max-w-xs text-center bg-slate-800 border border-slate-600 rounded-lg px-4 py-3 text-white text-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 mb-6"
                    />
                    <button
                        onClick={handleGameStart}
                        disabled={!tempPlayerName.trim()}
                        className="bg-yellow-400 text-blue-900 font-bold py-3 px-8 rounded-lg text-2xl shadow-lg hover:bg-yellow-300 transform hover:scale-105 transition-all duration-300 disabled:bg-slate-600 disabled:text-slate-400 disabled:cursor-not-allowed"
                    >
                        Começar Jogo
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="bg-slate-900 text-white min-h-screen flex flex-col items-center justify-between p-4 font-sans bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
            <header className="text-center w-full">
                <h1 className="text-5xl font-bold text-yellow-400" style={{ textShadow: '2px 2px 4px #000000' }}>
                    PokeWar
                </h1>
                <p className="text-slate-300 mt-2">O primeiro a {WINNING_SCORE} pontos vence!</p>
            </header>
            
            <main className="w-full flex flex-col items-center justify-center flex-grow">
                 {/* Placar & Baralhos */}
                <div className="w-full max-w-5xl bg-black bg-opacity-30 rounded-lg p-4 shadow-2xl border border-slate-700 mb-4 flex justify-between items-center">
                    <div className={`text-center p-2 rounded-lg transition-all duration-500 ${isPlayerTurn && gameState === 'CHOOSE' ? 'bg-blue-500/30 animate-pulse-blue' : ''}`}>
                        <p className="text-blue-400 text-2xl font-bold">{playerName}</p>
                        <p className="text-4xl">{playerScore}</p>
                    </div>
                    <div className='flex gap-8'>
                         <div className="text-center text-sm text-slate-400">
                            <p>Seu Baralho</p>
                            <p className="text-lg font-mono bg-slate-800 rounded-md px-2">{playerDeck.length}</p>
                        </div>
                        <div className="text-center text-sm text-slate-400">
                            <p>Baralho da IA</p>
                            <p className="text-lg font-mono bg-slate-800 rounded-md px-2">{aiDeck.length}</p>
                        </div>
                    </div>
                    <div className={`text-center p-2 rounded-lg transition-all duration-500 ${!isPlayerTurn && gameState === 'CHOOSE' ? 'bg-red-500/30 animate-pulse-red' : ''}`}>
                        <p className="text-red-400 text-2xl font-bold">IA</p>
                        <p className="text-4xl">{aiScore}</p>
                    </div>
                </div>

                {/* Arena de Batalha */}
                <div className="w-full max-w-5xl h-96 flex items-center justify-center relative">
                     <div className="grid grid-cols-3 gap-6 items-center justify-items-center w-full">
                        <div className="w-full flex justify-center perspective">
                            <PokemonCard pokemon={playerCard} revealed={!!playerCard} />
                        </div>
                        <div className="text-center text-4xl font-bold text-yellow-300">
                            VS
                        </div>
                        <div className="w-full flex justify-center perspective">
                             <PokemonCard pokemon={aiCard} revealed={aiCardRevealed} />
                        </div>
                    </div>
                </div>
            </main>

            <footer className="w-full flex flex-col items-center">
                 {/* Status & Ações */}
                <div className="text-center w-full max-w-md mb-4">
                    <p className="text-xl h-7 transition-opacity duration-300">{status}</p>
                </div>
                { (gameState === 'RESULT' || isGameOver) && (
                    <button
                        onClick={isGameOver ? handleResetGame : handleNextRound}
                        className="bg-yellow-400 text-blue-900 font-bold py-3 px-6 rounded-lg text-xl shadow-lg hover:bg-yellow-300 transform hover:scale-105 transition-all duration-300 mb-4"
                    >
                        {isGameOver ? 'Jogar Novamente' : 'Próxima Rodada'}
                    </button>
                )}
                
                {/* Mão do Jogador */}
                <div className="w-full bg-black bg-opacity-30 rounded-lg p-4 shadow-inner border border-slate-700">
                     <h2 className="text-center text-slate-300 mb-2 font-bold text-lg">Sua Mão ({playerHand.length})</h2>
                     <div className="flex justify-center items-end gap-2 h-48">
                        {playerHand.map((card) => (
                            <PokemonCard 
                                key={card.id} 
                                pokemon={card} 
                                revealed={true} 
                                isPlayable={gameState === 'CHOOSE' && (isPlayerTurn || !!aiCard)}
                                onSelect={() => handleCardPlay(card)}
                            />
                        ))}
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default App;