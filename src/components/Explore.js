import {h, Component} from 'preact';
import {Link} from 'preact-router';
import SearchBar from 'components/SearchBar';
import {readAtPath} from 'services/firebase';
import styles from 'styles/Explore.scss';

const PollCards = ({data, searching, query}) => {
  if (data && !searching) {
    const polls = Object.keys(data).map(key => {
      return (
        <Link class={styles.link} href={`/view/${key}`}>
          <div class={`${styles.card} mdc-card`}>
            <section class="mdc-card__primary">
              <h1 class="mdc-card__title mdc-card__title--large">{data[key].name}</h1>
            </section>
            <hr />
            <section class="mdc-card__supporting-text">
              {data[key].desc}
            </section>
          </div>
        </Link>
      );
    });

    return <div>{polls}</div>;
  } else if (data && searching) {
    const matchingKeys = Object.keys(data).filter(key => {
      return (~ data[key].name.toLowerCase().indexOf(query.toLowerCase()))
    });

    if (matchingKeys.length === 0) {
      return (
        <div class={`${styles.card} mdc-card`}>
          <section class="mdc-card__primary">
            <h1 className="mdc-card__title mdc-card__title--large">No results found.</h1>
          </section>
        </div>
      );
    }

    const polls = matchingKeys.map(key => {
      return (
        <Link class={styles.link} href={`/view/${key}`}>
          <div class={`${styles.card} mdc-card`}>
            <section class="mdc-card__primary">
              <h1 class="mdc-card__title mdc-card__title--large">{data[key].name}</h1>
            </section>
            <hr />
            <section class="mdc-card__supporting-text">
              {data[key].desc}
            </section>
          </div>
        </Link>
      );
    });

    return <div>{polls}</div>;
  }

  return (
    <div class={`${styles.card} mdc-card`}>
      <section class="mdc-card__primary">
        <h1 className="mdc-card__title mdc-card__title--large">Loading...</h1>
      </section>
    </div>
  );
}

export default class extends Component {
  state = {
    data: false,
    searching: false,
    query: ''
  }

  onSearchInput = evt => {
    this.setState({
      query: evt.target.value
    });
  }

  onSearchBack = () => {
    this.setState({
      searching: false
    });
  }

  handleData = snapshot => {
    const value = snapshot.val();
    this.setState({
      data: value
    });
  }

  componentDidMount = () => {
    readAtPath('/polls', 'value', this.handleData);

    document.getElementById('search').addEventListener('click', () => {
      this.setState({
        searching: true
      });
    });
  }

  render = (props, {data, searching, query}) => {
    return (
      <div class={styles.container}>
        <SearchBar
          onInput={this.onSearchInput}
          onBackClick={this.onSearchBack}
          show={searching}
        />
        <PollCards data={data} searching={searching} query={query} />
      </div>
    );
  }
}
