import { useState } from "react"
import './App.css'

const WINNING_LINES = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // Lignes
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // Colonnes
  [0, 4, 8], [2, 4, 6], // Diagonales
]

function getWinner(board) {
  // Parcourir chaque ligne gagnante possible définie dans WINNING_LINES
  // Chaque ligne est un tableau de 3 indices [a, b, c] représentant les positions à vérifier 
  for (const [a, b, c] of WINNING_LINES) {
    // Vérifie si les trois conditions sont remplies pour une victoire
    // 1. board[a] n'est pas null (la case 'a' doit être occupée)
    // 2. board[a] === board[b] (les cases 'a' et 'b' contiennent le même symbole)
    // 3. board[a] === board[c] (les cases 'a' et 'c' contiennent le même symbole)
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      // Si les trois cases d'une ligne gagnante contiennent le même symbole 
      // retourne ce symbole ('X' ou 'O') comme gagnant
      return board[a]
    }
  }
  // Si aucune ligne gagnante n'est trouvée, retourne null (pas de gagnant)
  return null
}

export default function App() {
  // utilisation de useState pour le plateau pour déclancher un nouveau rendu à chaque changement
  const [board, setBoard] = useState(Array(9).fill(null))
  const [isX, setIsX] = useState(true)
  const [scores, setScores] = useState([0, 0])

  const winner = getWinner(board)
  // Retourne true si chaque élément du tableau est "truthy"
  // C'est à dire ni null, ni undefined, ni une chaine vide
  const isDraw = !winner && board.every(Boolean)

  function handleClick(i) {
    // Est ce qu'il n'y a pas déjà quelque chose sur la case
    if (board[i] || winner) return
    // Est-ce qu'il y a un vainqueur ?
    // Copie du tableau (constante state) pour pouvoir le MODIFIER
    const newBoard = [...board]
    newBoard[i] = isX ? 'X' : 'O'
    setBoard(newBoard)
    setIsX(isX)
    const newWinner = getWinner(newBoard)
    if (newWinner === "X") setScores(s => [s[0] + 1, s[1]])
    else if (newWinner === "O") setScores(s => [s[0], s[1] + 1])

    const botMove = randomResponse(newBoard)
    if (botMove !== null) {
      newBoard[botMove] = 'O'
    }
  }

  function reset() {
    setBoard(Array(9).fill(null))
    setIsX(true)
  }

  function randomResponse(board) {
    if (!board.includes(null)) return null
    
    let i = Math.floor(Math.random() * 9)
    while (board[i] !== null) {
      i = Math.floor(Math.random() * 9)
    }
    return i
  }

  return (
    <div className="game">
      <h1>Tic Tac Toe</h1>

      <p className="score">
        score X : {scores[0]}<br />
        score O : {scores[1]}
      </p>

      <p className="status">
        {winner ?
          <span>Gagnant : <img className="status-img" src={winner === 'X' ? '/cross.png' : '/circle.png'} /></span>
          : isDraw ? "Match nul !"
            : <span>Tour du joueur : <img className="status-img" src={isX ? '/cross.png' : '/circle.png'} /></span>
        }
      </p>

      <div className="board">
        {board.map((cell, i) => (
          <button key={i} className="cell" onClick={() => handleClick(i)}>
            {cell && <img src={cell === 'X' ? '/cross.png' : '/circle.png'} />}
          </button>
        ))}
      </div>

      <button className="reset" onClick={reset}>Rejouer</button>
    </div>
  )
}