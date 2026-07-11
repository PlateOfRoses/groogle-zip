import styles from './style.module.css';

const fs = require('fs');


const x = {
    get_game(game_ID) {
        if (game_ID === 223) {
            return {
                "game_id": "1-4a6e7554-cc87-4dec-9339-28f9f2cba7de",
                "division": "MASTERS",
                "status": "STARTED",
                "start_date": 1583850400 * 1000,
                "end_date": 0,
                "team_one": "acf67962-a1c8-4012-bb55-1085c3d7f88b",
                "team_two": "5217cb03-f75e-45fa-aa61-851dc51060b9",
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
            "team_one": "66cbb42b-e236-4695-a024-7d7da41f50a3",
            "team_two": "bdc5a3bf-a44c-4dcd-9102-2ead0b9bb25b",
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
    }
}

        // const hours = (date.getHours() > 12 ? date.getHours() - 12 : (date.getHours() == 0 ? 12 : date.getHours()));
        // const meridiem = (date.getHours() > 11 ? "PM" : "AM");

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const TEAMS = JSON.parse(fs.readFileSync('./src/app/lib/faceit_teams.json', { encoding: 'utf8', flag: 'r' }));

export default function Game(game_ID) {
    const game_data = x.get_game(game_ID.children);

    const team_data = TEAMS[game_data.team_one];
    const team_two = TEAMS[game_data.team_two];

    if (team_two === undefined || team_two === undefined) {
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
            <img src={(team_data.seasons[9].team_image ? team_two.seasons[9].team_image : "https://i.imgur.com/HBzhmOZ.png")} alt="team"/>
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