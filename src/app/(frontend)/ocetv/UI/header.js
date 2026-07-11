import styles from './style.module.css';

export default function OceHeader() {
    return <div className={styles.header}>
        <div>
            <a href="/ocetv"><p>OWCE TV</p></a>
        </div>
        <div>
            <a href="/ocetv/matches"><p>Matches</p></a>
        </div>
        <div>
            <a href="/ocetv/seasons"><p>Seasons</p></a>
        </div>
        <div>
            <a><p>Fantasy (SOON)</p></a>
        </div>
    </div>;
}