import { useState } from "react"
import confetti from "canvas-confetti"

import { Square } from "./components/Square"
import { WinnerModal } from "./components/WinnerModal"
import { TURNS } from "./constanst"
//logica para revisar si hay ganador y si el juego ha termiado en empate
import { checkWinner, checkEndGame } from "./logic/board"
import { saveGameToStorage, resetGameStorage } from "./logic/storage"

function App() {

  // esta es la inicializacion del tablero antes de usar localstorage para guardar la partida
  // const [board, setBoard] = useState(Array(9).fill(null))

  // inicializacion de tablero
  const [board, setBoard] = useState(() => {
    // como se obtendra el local storage en el useState no se le pasa un valor inicial, sino, una funcion
    // la obtencion de el localstorage se realiza aqui, ya que, esto se ejecuta una vez,
    // en caso de ponerlo fuera de la inicializacion, cada que se renderea se ejecutara la obtencion de
    // localstorage alentando a la app
    const boardFromStorage = window.localStorage.getItem('board')
    if (boardFromStorage) return JSON.parse(boardFromStorage)
    return Array(9).fill(null)
  })

  // se inicializa el turno por defecto las X
  // de igual manera esta inicializacion era antes de usar localstorage para guardar el turno
  // const [turn, setTurn] = useState(TURNS.X)
  const [turn, setTurn] = useState(() => {
    const turnFromStorage = window.localStorage.getItem('turn')
    return turnFromStorage ?? TURNS.X
    // if (turnFromStorage) return turnFromStorage
    // return TURNS.X
  })
  const [winner, setWinner] = useState(null)

  const resetGame = () => {
    setBoard(Array(9).fill(null))
    setTurn(TURNS.X)
    setWinner(null)
    
    // resetea el estado del componente
    resetGameStorage()
  }

  const updateBoard = (index) => {
    // si la posicion ya tiene valor no cambia
    if (board[index] || winner) return

    // actualizar el tablero
    const newBoard = [...board] // spread y rest operator
    newBoard[index] = turn
    setBoard(newBoard)

    // cambiar de turno
    const newTurn = turn === TURNS.X ? TURNS.O : TURNS.X
    setTurn(newTurn)

    // guarda la partida
    saveGameToStorage({
      board: newBoard,
      turn: newTurn
    })

    // se revisa si existe ganador
    const newWinner = checkWinner(newBoard)
    if (newWinner) {
      confetti()
      setWinner(newWinner)
    } else if (checkEndGame(newBoard)){
      setWinner(false)
    }
  }

  return (
    <main className="board">
      <h1>3 en raya</h1>
      <button onClick={resetGame}>Reset del juego</button>
      <section className="game">
        { 
          board.map((square, index) => {
            return(
              <Square 
                key={index}
                index={index}
                updateBoard={updateBoard}
              >
                {square}
                {/* {board[index]} */}
              </Square>
            )
          })
        }
      </section>
      <section className="turn">
        <Square isSelected={turn === TURNS.X}>{TURNS.X}</Square>
        <Square isSelected={turn === TURNS.O}>{TURNS.O}</Square>
      </section>

      <WinnerModal resetGame={resetGame} winner={winner}/>
    </main>
  )
}

export default App
