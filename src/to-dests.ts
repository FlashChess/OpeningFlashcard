/**
 * Legal chess moves for chessground
 * @param {*} chess
 * fixed for chess.js@0.13.0 (Amir)
 */
 const toDests = (chess: any) => {
  const dests = new Map();
  chess.board().forEach((b: any) => {
    b.forEach((s: any) => {
      if (s != null) {
        const ms = chess.moves({ square: s.square, verbose: true });
        if (ms.length){
          const newMS = []
          for (let i = 0; i < ms.length; i++){
            newMS[i] = ms[i].to;
          }
          dests.set(s.square, newMS);
        } 
      }
    });
  });
  const color = chess.turn() === "w" ? "white" : "black";

  return {
    color, // who's turn is it
    dests, // what to move
    free: false
  };
};

export default toDests;
  