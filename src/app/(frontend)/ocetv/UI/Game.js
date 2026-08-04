import styles from './style.module.css';

const fs = require('fs');

        // const hours = (date.getHours() > 12 ? date.getHours() - 12 : (date.getHours() == 0 ? 12 : date.getHours()));
        // const meridiem = (date.getHours() > 11 ? "PM" : "AM");

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const TEAMS = JSON.parse(fs.readFileSync('./src/app/lib/faceit_teams.json', { encoding: 'utf8', flag: 'r' }));
const GAMES = JSON.parse(fs.readFileSync('./src/app/lib/faceit_games.json', { encoding: 'utf8', flag: 'r' }));

export default function Game(game_ID) {
    const game_data = GAMES.games[game_ID.children];
    console.log(game_data);
    const team_data = TEAMS[game_data.left_team];
    const team_two = TEAMS[game_data.right_team];

    console.log(team_data);

    if (team_two === undefined || team_data === undefined) {
        return <div className={styles.game}>
            Whoops!
        </div>
    }

    let match_date = "LIVE"
    if (game_data.status !== "STARTED") {
        let date = new Date(game_data.start_date);
        const month = MONTHS[date.getMonth()];
        const ddate = date.getDate();
        const hours = date.getHours();
        const minutes = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes());
        match_date = `${month} ${ddate}, ${hours}:${minutes}`;
    }

    return <div className={styles.game}>
        <div className={styles.mastersLine}/>
        <div className={styles.team}>
            <img src={(team_data.seasons[9].team_image ? team_data.seasons[9].team_image : "https://i.imgur.com/HBzhmOZ.png")} alt="team"/>
            {team_data.seasons[9].team_tag}
        </div>
        <div className={styles.matchTicker}>
            <div className={styles.matchDate}>
                {match_date}
            </div>
            <div className={styles.scores}>
                <div className={styles.teamOneScore}>?</div>
                <div className={styles.teamTwoScore}>?</div>
            </div>
            <div className={styles.mapsNeeded}>
                {"bo"+game_data.maps_required}
            </div>
        </div>
        <div className={styles.teamTwo}>
            <img src={(team_two.seasons[9].team_image ? team_two.seasons[9].team_image : "https://i.imgur.com/HBzhmOZ.png")} alt="team"/>
            {team_two.seasons[9].team_tag}
        </div>
        <div className={styles.mastersLine}/>
    </div>;
}