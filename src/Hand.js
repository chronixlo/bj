export default function Hand({
  handValue,
  enemyHandValue,
  cards,
  mirror,
  gameStatus,
}) {
  const handValueClass = (() => {
    if (handValue > 21) {
      return "hand-losing";
    }
    if (enemyHandValue > 21) {
      return "hand-winning";
    }

    if (handValue > enemyHandValue) {
      return "hand-winning";
    }
    if (handValue < enemyHandValue) {
      return "hand-losing";
    }
    return "";
  })();

  return (
    <div className={"hand " + (mirror ? "hand-mirror" : "")}>
      <div className={"hand-value " + handValueClass}>
        {handValue}

        {gameStatus === "FINISHED" && handValueClass === "hand-winning" && (
          <span className="result-icon">🏆</span>
        )}
      </div>

      <div className="cards">
        {cards.map((card, idx) => (
          <div className={"card card-" + card.suit.symbol} key={idx}>
            <div className="card-face">
              <div className="card-face-top">
                <div>{card.rank.symbol}</div>
                <div className="emoji">{card.suit.symbol}</div>
              </div>

              <div className="card-face-bottom">
                <div>{card.rank.symbol}</div>
                <div className="emoji">{card.suit.symbol}</div>
              </div>

              <div className="card-face-inner">
                {new Array(card.rank.value).fill().map((_, aIdx) => (
                  <div key={aIdx} className="emoji">
                    {card.suit.symbol}
                  </div>
                ))}
              </div>
            </div>
            <div className="card-back">
              <div className="card-back-inner"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
