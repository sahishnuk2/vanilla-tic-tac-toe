import "./Modal.css";

type Prop = {
  message: string;
};
export default function Modal({ message }: Prop) {
  return (
    <div className="modal">
      <div className="modal-contents">
        <p>{message}</p>
        <button>Play Again</button>
      </div>
    </div>
  );
}
