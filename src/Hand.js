import { getHandValue } from "./utils";

export default function Hand({ cards }) {
  return (
    <div className="hand">
      <div className="hand-value">{getHandValue(cards)}</div>

      <div className="cards">
        {cards.map((card) => (
          <div className={"card card-" + card.suit.symbol}>
            <div>{card.rank.symbol}</div>
            <div>{card.suit.symbol}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
