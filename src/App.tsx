import { useState, useRef, useEffect } from "react";
import Chessground from "react-chessground";
import "./CSSstyles/chess.css";
import "./CSSstyles/styles.css";
import "./CSSstyles/theme.css";
import toDests from "./to-dests";
import { useSearchParams } from "react-router-dom";
import { Chess } from "chess.js";
import { pgnPrint } from '@mliebelt/pgn-viewer';
import ConvertPGNtoArray from "./ConvertPGNtoArray";
import useSound from "use-sound";

// Valid Link:
// http://localhost:3000/flashcards/?pgn=1.%20e4%20e5%202.%20Nf3%20Nc6%203.%20Bb5%20a6%204.%20Ba4%20Nf6%205.%20O-O%20Be7%206.%20Re1%20b5%207.%20Bb3&move=3&turn=black&orientation=white&title=Closed%20Ruy%20Lopez&description=Black%20chose%20not%20to%20capture%20White%27s%20e-pawn%20on%20the%20previous%20move,%20but%20the%20threat%20still%20hangs%20over%20White%27s%20head.%20White%20typically%20removes%20it%20with

// API: 
// http://localhost:3000/flashcards/?
// pgn=&
// move=&
// turn=&
// orientation=&
// title=&
// description=

// Sound
const moveSound = require("./Sound/move.mp3");
const captureSound = require("./Sound/capture.mp3");
const errorSound = require("./Sound/error.mp3");
const energySound = require("./Sound/energy.mp3");

export default function App() {
  // URL:
  const [searchParams, setSearchParams] = useSearchParams();
  const plannedPGN = searchParams.get("pgn");
  const move = searchParams.get("move");
  const turn = searchParams.get("turn");
  const orientation = searchParams.get("orientation");
  const title = searchParams.get("title");
  const description = searchParams.get("description");

  if (plannedPGN !== null && move !== null && turn !== null && orientation !== null){
    return InteractiveChessBoardComponent(plannedPGN, parseInt(move), turn, orientation, title, description)
  }
  else {
    return (
    <div>
      <h1>Waiting for URL variables.</h1>
    </div>
    );
  }

  // If all important url variables is here, then 
  //   return InteractiveChessBoardComponent
  // If there is no url variables
  //   return Homepage
  // Else 
  //   return error (about url structure)
}

function InteractiveChessBoardComponent(plannedPGN: string, move: number, turn: string, orientation: string, title: string | null, description: string | null){
    // Variables that computed once
    const ArrPlannedPGN = useRef<string[]>([]);
    const initialPGN = useRef<string>();
    const initialFEN = useRef<string>(); 
    const point = useRef<number>(0);
    
    // Variables that determine current state
    const [fen, setFen] = useState<string>();
    let chess = new Chess(fen);
    const turnColor = chess.turn() === "w" ? "white" : "black";
    const pgn = useRef<string>();
    const [ind, setInd] = useState(-1);
  
    // useSound
    const [playMoveSound] = useSound(moveSound);
    const [playCaptureSound] = useSound(captureSound);
    const [playErrorSound] = useSound(errorSound);
    const [playEnergySound] = useSound(energySound);
  
    // Arrow Functions:
    const isItPlannedMove = () => {
      if (chess.in_check()){
        return(getLastMove() === getPlannedMove() + '+')
      }
      return(getLastMove() === getPlannedMove());
    }
  
    const getLastMove = () => {
      var temp = chess.history();
      return temp[temp.length - 1];
    }
  
    const getPlannedMove = () => {
      return (ArrPlannedPGN.current[ind]);
    }
  
    const changePGN_forPrinting = () => {
      var temp = chess.history();
      pgn.current += " " + temp[temp.length - 1];
    }
  
    const resetOfChess = () => {
      pgn.current = initialPGN.current;
      chess = new Chess(initialFEN.current);
      setFen(chess.fen);
      setInd(point.current);
    }
  
    const movable = (e: any) => {
      if (ind < ArrPlannedPGN.current.length){
        return(toDests(e));
      }
      else{
        const dests = new Map();
        const color = e.turn() === "w" ? "white" : "black";
      
        return {
          color, // who's turn is it
          dests, // what to move
          free: false
        };
      }
    }
  
    const handleMove = (from: any, to: any) => {
      chess.move({ from, to, promotion:'q'  });
  
      setFen(chess.fen());
  
      if (isItPlannedMove()){
        if (getLastMove().includes("x")){
          playCaptureSound();
        }
        else{
          playMoveSound();
        }
  
        changePGN_forPrinting();
        setInd(ind + 1);
      }
      else {
        setTimeout(() => {
          playErrorSound();
          chess.undo();
          setFen(chess.fen);
        }, 100)
      }
    };
  
    const handleHint = () => {
      if (ind >= ArrPlannedPGN.current.length){
        return; 
      }
  
      chess.move(ArrPlannedPGN.current[ind]);
      setFen(chess.fen());
      if (ind < ArrPlannedPGN.current.length){
        changePGN_forPrinting();
        setInd(ind + 1);
      }
      
      if (getLastMove().includes("x")){
        playCaptureSound();
      }
      else{
        playMoveSound();
      }
    }
  
    const goodJob = () => {
      playEnergySound();
      return(
        <h1>Good Job</h1>
      );
    }
  
    useEffect(() => {
      pgnPrint('PGNp', { pgn: pgn.current, notationLayout: 'list' });
    }, [pgn.current]);
  
    // executes only once at the end of first rendering 
    useEffect(() => {
      if (turn == "white"){
        point.current = (move - 1) * 2;
      }
      else {
        point.current = (move - 1) * 2 + 1; 
      }
  
      ArrPlannedPGN.current = ConvertPGNtoArray(plannedPGN);
      const tempChess = new Chess();
  
      for (let i = 0; i < point.current; i++){
        tempChess.move(ArrPlannedPGN.current[i]);
      }
  
      initialPGN.current = tempChess.history().join(' ');
      initialFEN.current = tempChess.fen();
      setFen(initialFEN.current);
      pgn.current = initialPGN.current;
      setInd(point.current);
    }, []);
  
    return (
      <div className="App">
        <h1 className = "chessOpening">{ title }</h1>
  
        <div className = "leftbox">
          <div className = "descriptionBlock">
            <h2>Description</h2>
            <p>{ description }</p>
          </div>
        </div> 
          
        <div className = "middlebox">
          <Chessground
            orientation = { orientation }
            fen={fen}
            turnColor={turnColor}
            onMove={handleMove}
            movable={movable(chess)}
          />
        </div>
          
        <div className = "rightbox">
          <div id = "PGNp" />
        </div>
  
        <button onClick={resetOfChess}>Do again</button>
        <button onClick={handleHint}>Hint</button>
  
        <div>
          { ind >= ArrPlannedPGN.current.length && goodJob() }
        </div>
      </div>
    );
}