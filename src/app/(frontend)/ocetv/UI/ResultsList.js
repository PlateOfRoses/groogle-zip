import styles from './style.module.css';
import Game from "@/app/(frontend)/ocetv/UI/Game";

const fs = require('fs');


export default function Results() {
    const completed_games = JSON.parse(fs.readFileSync('./src/app/lib/faceit_games.json', { encoding: 'utf8', flag: 'r' })).completed;

    const lst = []
    for (const match of completed_games) {
        lst.push(
            <Game key={match}>{match}</Game>
        )
    }
    return <div className={styles.leftSidebar}>
        {lst}
    </div>
}