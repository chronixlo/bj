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

  const playPlayer2 = async () => {
    await sleep(300);

    let done = false;

    const player1HandValue = getHandValue(game.player1.hand);

    while (!done) {
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

    game.status = "FINISHED";
    socket.emit("update", game);
  };

  socket.on("create_game", async (event) => {
    gameId = Math.random().toString(36).slice(2);

    game = {
      gameId,
      status: "INITIALIZING",
      deck: getDeck(),
      deckIndex: 0,
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

    if (handValue > 21) {
      game.status = "FINISHED";
      game.player2.score++;
    } else if (handValue === 21) {
      game.status = "PLAYER2_TURN";
      playPlayer2();
    }

    socket.emit("update", game);
  });

  socket.on("stay", () => {
    console.log("stay");

    game.status = "PLAYER2_TURN";
    socket.emit("update", game);

    playPlayer2();
  });

  socket.on("go_again", async () => {
    console.log("go_again");

    game.status = "GAME_STARTING";
    game.player1.hand = [];
    game.player2.hand = [];

    socket.emit("update", game);

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

server.listen(4000);
