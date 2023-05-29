import { WINNER_COMBOS } from "../constanst"

export const checkWinner = (boardToCheck) => {
  // revision de las combinaciones ganadoras para saber si existe un ganador
  for (const combo of WINNER_COMBOS) {
    const [a, b, c] = combo
    if (
      boardToCheck[a] &&
      boardToCheck[b] === boardToCheck[a] &&
      boardToCheck[c] === boardToCheck[a]
    ) {
      return boardToCheck[a]
    }
  }
  return null
}

export const checkEndGame = (newBoard) => {
  // revisamos si no hay espacios vacios en el tablero
  return newBoard.every((square) => square != null)
}