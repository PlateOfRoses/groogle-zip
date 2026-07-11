import styles from './style.module.css';
import Game from "@/app/(frontend)/ocetv/UI/Game";

export default function Results() {
    return <div className={styles.leftSidebar}>
        <Game>{123}</Game>
        <Game>{223}</Game>
    </div>
}