export default function LeaderboardDialog({ data, onClose }) {
  return (
    <div className="dialog-container" onClick={onClose}>
      <div className="dialog">
        <div className="dialog-title">Leaderboard</div>
        <div className="dialog-content">
          {data?.map((user, idx) => (
            <div
              key={idx}
              style={{ display: "flex", justifyContent: "space-between" }}
            >
              <div style={{ marginRight: 20 }}>{user.name}</div>
              <div>{user.rating}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
