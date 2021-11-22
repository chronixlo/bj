const CARDS = [];

const SUITS = [
  {
    id: "HEART",
    symbol: "♥",
  },
  {
    id: "DIAMOND",
    symbol: "♦",
  },
  {
    id: "SPADE",
    symbol: "♠",
  },
  {
    id: "CLUB",
    symbol: "♣",
  },
];

const RANKS = [
  { symbol: "2", value: 2 },
  { symbol: "3", value: 3 },
  { symbol: "4", value: 4 },
  { symbol: "5", value: 5 },
  { symbol: "6", value: 6 },
  { symbol: "7", value: 7 },
  { symbol: "8", value: 8 },
  { symbol: "9", value: 9 },
  { symbol: "10", value: 10 },
  { symbol: "J", value: 10 },
  { symbol: "Q", value: 10 },
  { symbol: "K", value: 10 },
  { symbol: "A", value: 1 },
];

for (let i = 0; i < 52; i++) {
  CARDS.push({
    suit: SUITS[i % 4],
    rank: RANKS[Math.floor(i / 4)],
  });
}

const getDeck = (num = 1) => {
  return new Array(num)
    .fill(CARDS)
    .flat()
    .sort(() => Math.random() - 0.5);
};

const getHandValue = (hand) => {
  return hand.reduce((acc, next) => acc + next.rank.value, 0);
};

module.exports = {
  CARDS,
  SUITS,
  RANKS,
  getDeck,
  getHandValue,
};
