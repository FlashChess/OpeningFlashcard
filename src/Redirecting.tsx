import { useSearchParams } from "react-router-dom";
import "./styles.css";

export default function Redirecting() {
    const LinkPart = "https://flashchess.github.io/flashcard/?";

    const [params, setParams] = useSearchParams();
    const title = params.get("title");
    const description = params.get("description");
    const pgn = params.get("pgn");
    const move = params.get("move");
    var turn = params.get("turn");
    var orientation = params.get("orientation");

    window.location.href = LinkPart + "title=" + title + "&description=" + description + "&pgn=" + pgn + "&move=" + move + "&turn=" + turn + "&orientation=" + orientation;

    return (
        <div className="box">
            <h1>...Redirecting</h1>
        </div>
    );
}