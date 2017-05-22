import {h, Component} from 'preact';
import {Link} from 'preact-router';
import SearchBar from 'components/SearchBar';
import {readAtPath} from 'services/firebase';
import styles from 'styles/Explore.scss';

export default class extends Component {
  state = {
    polls: (
      <div class="mdc-card">
        <section class="mdc-card__primary">
          <h1 className="mdc-card__title mdc-card__title--large">Loading...</h1>
        </section>
      </div>
    ),
    searching: false
  }

  onSearchInput = () => {}

  onSearchBack = () => {
    this.setState({
      searching: false
    });
  }

  componentDidMount = () => {
    readAtPath('/polls', 'value', snapshot => {
      const value = snapshot.val();
      const keys = Object.keys(value);
      const polls = keys.map(key => {
        return (
          <Link class={styles.link} href={`/view/${key}`}>
            <div class={`${styles.card} mdc-card`}>
              <section class="mdc-card__primary">
                <h1 class="mdc-card__title mdc-card__title--large">{value[key].name}</h1>
              </section>
              <hr />
              <section class="mdc-card__supporting-text">
                {value[key].desc}
              </section>
            </div>
          </Link>
        );
      });
      this.setState({
        polls
      });
    });

    document.getElementById('search').addEventListener('click', () => {
      this.setState({
        searching: true
      });
    });
  }

  render = (props, {polls, searching}) => {
    return (
      <div class={styles.container}>
        <SearchBar
          onInput={this.onSearchInput}
          onBackClick={this.onSearchBack}
          show={searching}
        />
        {polls}
      </div>
    );
  }
}
