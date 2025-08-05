import "./Modal.css";

type Prop = {
  message: string;
  onClick(): void;
};
export default function Modal({ message, onClick }: Prop) {
  return (
    <div className="modal">
      <div className="modal-contents">
        <p>{message}</p>
        <button onClick={onClick}>Play Again</button>
      </div>
    </div>
  );
}
