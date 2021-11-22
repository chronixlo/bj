import { useEffect, useMemo, useRef, useState } from "react";
import { io } from "socket.io-client";
import Hand from "./Hand";
import RoundWins from "./RoundWins";
import { getHandValue } from "./utils";

const hasLargeEmojis = navigator.userAgent.match(
  /iphone|ipad|android|macintosh/i
);

export default function App() {
  const [game, setGame] = useState();

  const player1HandValue = useMemo(
    () => game?.player1 && getHandValue(game.player1.hand),
    [game?.player1]
  );
  const player2HandValue = useMemo(
    () => game?.player2 && getHandValue(game.player2.hand),
    [game?.player2]
  );

  const socketRef = useRef();

  useEffect(() => {
    const socket = (socketRef.current = io(process.env.REACT_APP_WS_ROOT));

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

      window.history.replaceState(null, null, "./?" + gameState.gameId);
    });

    socket.on("player_join", (gameState) => {
      setGame(gameState);
    });

    socket.on("terminated", (e) => {});

    socket.on("not_found", (e) => {
      window.history.replaceState(null, null, "./");
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
    <div className={"app " + (hasLargeEmojis ? "small-emojis" : "")}>
      <div className="app-inner">
        <div className="player-portrait">ENEMY</div>

        <RoundWins
          wins={game.player2?.score || 0}
          roundsToWin={game.roundsToWin}
        />

        <Hand
          cards={game.player2?.hand || []}
          handValue={player2HandValue}
          enemyHandValue={player1HandValue}
          mirror
          gameStatus={game.status}
        />

        <div className="divider">
          <div />

          <div style={{ flex: 1 }}></div>

          <div>
            <div className="card">
              <div className="card-back no-anim">
                <div className="card-back-inner"></div>
              </div>
            </div>
            <div>{game.deckSize - game.deckIndex}</div>
          </div>
        </div>

        <Hand
          cards={game.player1?.hand || []}
          handValue={player1HandValue}
          enemyHandValue={player2HandValue}
          gameStatus={game.status}
        />

        <RoundWins
          wins={game.player1?.score || 0}
          roundsToWin={game.roundsToWin}
        />

        <div className="player-portrait">
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
                    socketRef.current.emit("next_round");
                  }}
                >
                  NEXT ROUND
                </button>
              </>
            )}

            {game.status === "GAME_OVER" && (
              <>
                <button
                  className="action-button"
                  onClick={() => {
                    socketRef.current.emit("create_game");
                  }}
                >
                  NEW GAME
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
