export default function RoundWins({ wins, roundsToWin }) {
  return (
    <div className="round-wins">
      {new Array(roundsToWin).fill().map((_, idx) => (
        <div className={"round " + (wins > idx ? "round-won" : "")} key={idx} />
      ))}
    </div>
  );
}
