import styles from './style.module.css';

const x = {
    get_game(game_ID) {
        if (game_ID === 223) {
            return {
                "game_id": "1-4a6e7554-cc87-4dec-9339-28f9f2cba7de",
                "division": "MASTERS",
                "status": "STARTED",
                "start_date": 1583850400 * 1000,
                "end_date": 0,
                "team_one": 32139123,
                "team_two": 61598272,
                "maps_required": 5,
                "maps": [
                    {
                        "map": "Ilios",
                        "winner": 32139123, // NULLABLE
                        "bans": [
                            "hero", "hero"
                        ],
                        "stats": { // HAVE TO MAKE THIS
                            32139123: [
                                {
                                    "player_id": 12381203712,
                                    "player_name": "Kawhi",
                                }
                            ]
                        }
                    }
                ]
            };
        }
        return {
            "game_id": "1-4a6e7554-cc87-4dec-9339-28f9f2cba7de",
            "division": "MASTERS",
            "status": "WAITING",
            "start_date": 1783824300 * 1000,
            "end_date": 0,
            "team_one": 32139123,
            "team_two": 61598272,
            "maps_required": 7,
            "maps": [
                {
                    "map": "Ilios",
                    "winner": 32139123, // NULLABLE
                    "bans": [
                        "hero", "hero"
                    ],
                    "stats": { // HAVE TO MAKE THIS
                        32139123: [
                            {
                                "player_id": 12381203712,
                                "player_name": "Kawhi",
                            }
                        ]
                    }
                }
            ]
        };
    },
    get_team(team_ID) {
        if (team_ID === 32139123) {
            return {
                "team_id": team_ID,
                "team_name": "xD wavefy",
                "team_tag": "XDW",
                "team_image": "https://distribution.faceit-cdn.net/images/bfac3737-7dcf-4e63-80fa-de134e01bf10.jpg"
            }
        }
        return {
            "team_id": team_ID,
            "team_name": "FURY",
            "team_tag": "FURY",
            "team_image": "https://distribution.faceit-cdn.net/images/b19ea491-e668-4c96-b919-537b532a607a.jpg"
        }
    }
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export default function Game(game_ID) {
    const game_data = x.get_game(game_ID.children);
    const team_data = x.get_team(game_data.team_one);
    const team_two = x.get_team(game_data.team_two);

    let match_date = "LIVE"
    if (game_data.status !== "STARTED") {
        let date = new Date(game_data.start_date);
        const month = MONTHS[date.getMonth()];
        const ddate = date.getDate();
        // const hours = (date.getHours() > 12 ? date.getHours() - 12 : (date.getHours() == 0 ? 12 : date.getHours()));
        const hours = date.getHours();
        const minutes = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes());
        // const meridiem = (date.getHours() > 11 ? "PM" : "AM");
        match_date = `${month} ${ddate}, ${hours}:${minutes}`;
    }

    return <div className={styles.game}>
        <div className={styles.mastersLine}/>
        <div className={styles.team}>
            <img src={team_data.team_image} alt="team"/>
            {team_data.team_tag}
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
            <img src={team_two.team_image} alt="team"/>
            {team_two.team_tag}
        </div>
        <div className={styles.mastersLine}/>
    </div>;
}