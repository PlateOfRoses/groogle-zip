import styles from './index.module.css'

export default function Page() {
  return <main>
            <div className="groogle-text">
              <a>Groogle</a>
            </div>
            <div id={styles.cards}>
              <a href="twabs">
                <div className={styles.card}>
                  <img id={styles.twab} src="/2023_Season_of_the_Deep_PressKit_Veil_Mission_Compressed_003.jpg"/>
                  <span className={styles.title}>Twab Search</span>
                  <span className={styles.content}>Destiny 2 Twabs and Hotfix Search Tool</span>
                </div>
              </a>
              <a href="povs">
                <div className={styles.card}>
                  <img id={styles.owcs} src="/owcs.png"/>
                  <span className={styles.title}>OWCS POVs</span>
                  <span className={styles.content}>Overwatch 2 @ObsSojourn player POV search tool</span>
                </div>
              </a>
            </div>
          </main>
}