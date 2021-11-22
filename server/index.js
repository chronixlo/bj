const { getDeck, getHandValue } = require("./utils");

const server = require("http").createServer();
const io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

const games = {};

const sleep = (ms) =>
  new Promise((resolve) => {
    setTimeout(resolve, ms);
  });

io.on("connection", (socket) => {
  console.log("a user connected");

  let gameId;
  let game;

  const drawCard = () => {
    const card = game.deck[game.deckIndex];
    game.deckIndex++;
    return card;
  };

  const playPlayer2Start = async () => {
    await sleep(300);

    const player1HandValue = getHandValue(game.player1.hand);

    while (true) {
      const handValue = getHandValue(game.player2.hand);

      if (handValue > 21) {
        game.player1.score++;
        if (
          game.player1.score === game.roundsToWin ||
          game.player2.score === game.roundsToWin
        ) {
          game.status = "GAME_OVER";
        } else {
          game.status = "FINISHED";
        }
        socket.emit("update", game);
        return;
      }

      // stay @ 17 if over player
      if (handValue > player1HandValue && handValue > 16) {
        break;
      }

      game.player2.hand = [...game.player2.hand, drawCard()];

      socket.emit("update", game);

      await sleep(300);
    }

    game.status = "PLAYER1_TURN";
    socket.emit("update", game);
  };

  const playPlayer2 = async () => {
    await sleep(300);

    const player1HandValue = getHandValue(game.player1.hand);

    while (true) {
      const handValue = getHandValue(game.player2.hand);

      if (handValue > 21) {
        game.player1.score++;
        break;
      }

      if (handValue > player1HandValue) {
        game.player2.score++;
        break;
      }

      game.player2.hand = [...game.player2.hand, drawCard()];

      socket.emit("update", game);

      await sleep(300);
    }

    if (
      game.player1.score === game.roundsToWin ||
      game.player2.score === game.roundsToWin
    ) {
      game.status = "GAME_OVER";
    } else {
      game.status = "FINISHED";
    }
    socket.emit("update", game);
  };

  socket.on("create_game", async (event) => {
    gameId = Math.random().toString(36).slice(2);

    const deck = getDeck();

    game = {
      gameId,
      status: "INITIALIZING",
      roundsToWin: 3,
      deck,
      deckSize: deck.length,
      deckIndex: 0,
      round: 0,
      player1: {
        id: socket.id,
        score: 0,
        hand: [],
      },
      player2: null,
    };

    games[gameId] = game;

    game.status = "WAITING_OPPONENT";

    socket.emit("join", game, true);
    socket.to(gameId).emit("player_join", "");

    socket.join(gameId);

    // bot join
    await sleep(500);

    game.player2 = {
      id: Math.random().toString(36).slice(2),
      score: 0,
      hand: [],
    };

    game.status = "GAME_STARTING";

    socket.emit("player_join", game);

    await sleep(500);

    game.player1.hand = [...game.player1.hand, drawCard()];
    socket.emit("update", game);
    await sleep(300);
    game.player2.hand = [...game.player2.hand, drawCard()];
    socket.emit("update", game);
    await sleep(300);
    game.player1.hand = [...game.player1.hand, drawCard()];
    socket.emit("update", game);
    await sleep(300);
    game.player2.hand = [...game.player2.hand, drawCard()];
    socket.emit("update", game);
    await sleep(300);

    game.status = "PLAYER1_TURN";

    socket.emit("update", game);
  });

  socket.on("join_game", (event) => {
    gameId = event.gameId;

    game = games[gameId];

    if (!game || game.player2) {
      socket.emit("not_found");
      return;
    }

    game.player2 = {
      id: socket.id,
      score: 0,
      hand: [],
    };

    socket.join(gameId);
    socket.emit("join", game, false);
    socket.to(gameId).emit("player_join", game);
  });

  socket.on("hit", () => {
    console.log("hit");

    if (game.status !== "PLAYER1_TURN") {
      return;
    }

    game.player1.hand = [...game.player1.hand, drawCard()];

    const handValue = getHandValue(game.player1.hand);

    const mod = game.round % 2;

    if (handValue > 21) {
      game.player2.score++;
      if (
        game.player1.score === game.roundsToWin ||
        game.player2.score === game.roundsToWin
      ) {
        game.status = "GAME_OVER";
      } else {
        game.status = "FINISHED";
      }
    } else if (handValue === 21) {
      if (mod === 0) {
        game.status = "PLAYER2_TURN";
        playPlayer2();
      } else {
        if (handValue > getHandValue(game.player2.hand)) {
          game.player1.score++;
        }
        if (
          game.player1.score === game.roundsToWin ||
          game.player2.score === game.roundsToWin
        ) {
          game.status = "GAME_OVER";
        } else {
          game.status = "FINISHED";
        }
      }
    }

    socket.emit("update", game);
  });

  socket.on("stay", () => {
    console.log("stay");

    if (game.status !== "PLAYER1_TURN") {
      return;
    }

    const mod = game.round % 2;

    if (mod === 0) {
      game.status = "PLAYER2_TURN";
      playPlayer2();
    } else {
      const p1 = getHandValue(game.player1.hand);
      const p2 = getHandValue(game.player2.hand);

      if (p1 > p2) {
        game.player1.score++;
      } else if (p2 > p1) {
        game.player2.score++;
      }
      if (
        game.player1.score === game.roundsToWin ||
        game.player2.score === game.roundsToWin
      ) {
        game.status = "GAME_OVER";
      } else {
        game.status = "FINISHED";
      }
    }

    socket.emit("update", game);
  });

  socket.on("next_round", async () => {
    console.log("next_round");

    game.round++;
    game.status = "GAME_STARTING";
    game.player1.hand = [];
    game.player2.hand = [];

    const mod = game.round % 2;
    const startingPlayer = mod + 1;
    const secondPlayer = 1 - mod + 1;

    socket.emit("update", game);

    await sleep(500);

    game["player" + startingPlayer].hand = [
      ...game["player" + startingPlayer].hand,
      drawCard(),
    ];
    socket.emit("update", game);
    await sleep(300);
    game["player" + secondPlayer].hand = [
      ...game["player" + secondPlayer].hand,
      drawCard(),
    ];
    socket.emit("update", game);
    await sleep(300);
    game["player" + startingPlayer].hand = [
      ...game["player" + startingPlayer].hand,
      drawCard(),
    ];
    socket.emit("update", game);
    await sleep(300);
    game["player" + secondPlayer].hand = [
      ...game["player" + secondPlayer].hand,
      drawCard(),
    ];
    socket.emit("update", game);
    await sleep(300);

    game.status = "PLAYER" + startingPlayer + "_TURN";

    if (mod === 1) {
      playPlayer2Start();
    }

    socket.emit("update", game);
  });

  socket.on("disconnect", () => {
    let gameId;

    Object.keys(games).forEach((id) => {
      const game = games[id];
      if (
        game &&
        (game.player1.id === socket.id ||
          (game.player2 && game.player2.id === socket.id))
      ) {
        gameId = id;
      }
    });

    if (gameId) {
      games[gameId] = null;
      io.to(gameId).emit("terminated");
    }
  });
});

server.listen(process.env.PORT || 4000);
