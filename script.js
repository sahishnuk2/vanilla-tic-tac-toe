import View from "./view.js";
import Store from "./store.js";

// window.onload = App.init;
// window.addEventListener("load", App.init);

const players = [
  {
    id: 1,
    name: "Player 1",
    iconClass: "fa-x",
    colorClass: "turquoise",
  },

  {
    id: 2,
    name: "Player 2",
    iconClass: "fa-o",
    colorClass: "yellow",
  },
];

function init() {
  let view = new View();
  let store = new Store("live-t3-key", players);

  store.addEventListener("statechange", (event) => {
    view.render(store.game, store.stats);
  });

  window.onstorage = (event) => {
    console.log("changed from another tab");
    view.render(store.game, store.stats);
  };

  view.bindGameResetEvent((event) => {
    store.reset();
    //view.render(store.game, store.stats);
  });

  view.bindNewRoundEvent((event) => {
    store.newRound();
    //view.render(store.game, store.stats);
  });

  view.bindPlayerMoveEvent((square) => {
    const existingMove =
      store.game.moves.filter((x) => x.squareId === +square.id).length !== 0;

    if (existingMove) {
      return;
    }

    // Updates the state
    store.playerMove(+square.id);

    //view.render(store.game, store.stats);
  });
}

window.onload = init;
