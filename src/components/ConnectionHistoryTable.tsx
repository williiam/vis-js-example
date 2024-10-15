interface ConnectionEntry {
  time: string;
  direction: "outgoing" | "incoming";
  otherIP: string;
  service: string;
  srcPort: string;
  dstPort: string;
}

interface ConnectionHistoryTableProps {
  history: ConnectionEntry[];
  nodeIP: string;
  isOpen: boolean;
  onClose: () => void;
}

const ConnectionHistoryTable: React.FC<ConnectionHistoryTableProps> = ({
  history,
  nodeIP,
  isOpen,
  onClose,
}) => {
  return (
    <div className={`connection-history ${isOpen ? "open" : "close"}`}>
      <button type="button" onClick={onClose} className="close-button">
        X
      </button>
      <h3>Connection History for {nodeIP}</h3>
      <table>
        <thead>
          <tr>
            <th>Time</th>
            <th>Direction</th>
            <th>Other IP</th>
            <th>Service</th>
            <th>Source Port</th>
            <th>Destination Port</th>
          </tr>
        </thead>
        <tbody>
          {history.map((entry, index) => (
            <tr key={`${entry.time}-${index}`}>
              <td>{entry.time}</td>
              <td>{entry.direction}</td>
              <td>{entry.otherIP}</td>
              <td>{entry.service}</td>
              <td>{entry.srcPort}</td>
              <td>{entry.dstPort}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ConnectionHistoryTable;
