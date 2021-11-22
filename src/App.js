import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import Hand from "./Hand";

export default function App() {
  const [status, setStatus] = useState();
  const [game, setGame] = useState();

  const socketRef = useRef();

  useEffect(() => {
    const socket = (socketRef.current = io("http://localhost:4000"));

    socket.on("connect", (e) => {
      const gameId = window.location.search.slice(1);
      if (gameId) {
        socket.emit("join_game", { gameId });
      } else {
        socket.emit("create_game", {});
      }
    });

    socket.on("join", (gameState) => {
      setGame(gameState);

      window.history.replaceState(null, null, "/?" + gameState.gameId);
    });

    socket.on("player_join", (gameState) => {
      setGame(gameState);

      setStatus("GAME_STARTING");
    });

    socket.on("terminated", (e) => {
      setStatus("TERMINATED");
    });

    socket.on("not_found", (e) => {
      window.history.replaceState(null, null, "/");
      socket.emit("create_game", {});
    });

    socket.on("update", (gameState) => {
      setGame(gameState);
    });
  }, []);

  if (!game) {
    return null;
  }

  return (
    <div className="app">
      <Hand cards={game.player2?.hand || []} />

      <div>score: {game.player2?.score}</div>

      <div className="divider">
        <div />

        <div>round {game.round + 1}</div>

        <div>
          <div className="card card-♠">♠</div>
          <div>{game.deckSize - game.deckIndex}</div>
        </div>
      </div>

      <div>score: {game.player1?.score}</div>

      <Hand cards={game.player1?.hand || []} />

      <div className="actions">
        {game.status === "PLAYER1_TURN" && (
          <>
            <button
              className="action-button hit"
              onClick={() => {
                socketRef.current.emit("hit");
              }}
            >
              HIT
            </button>

            <button
              className="action-button stay"
              onClick={() => {
                socketRef.current.emit("stay");
              }}
            >
              STAY
            </button>
          </>
        )}
        {game.status === "FINISHED" && (
          <>
            <button
              className="action-button"
              onClick={() => {
                socketRef.current.emit("go_again");
              }}
            >
              GO AGAIN
            </button>
          </>
        )}
      </div>
    </div>
  );
}
