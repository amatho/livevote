import {h, Component} from 'preact';
import {readAtPath, readAtPathOnce, setAtPath} from 'services/firebase';
import {ripple} from 'material-components-web';
import PollChart from 'components/PollChart';
import styles from 'styles/ViewPoll.scss';

export default class extends Component {
  state = {
    name: 'Loading...'
  }

  onSubmit = evt => {
    evt.preventDefault();

    const pollOptions = document.getElementById('viewPollOptions').querySelectorAll('.mdc-radio input');
    pollOptions.forEach(option => {
      if (option.checked) {
        const votedId = option.id.replace('vote-', '');
        const votePath = `/polls/${this.id}/options/${votedId}`;
        readAtPathOnce(votePath, 'value', snapshot => {
          setAtPath(votePath, snapshot.val() + 1);
        });

        this.afterVoted();
      }
    });
  }

  afterVoted = () => {
    const formRect = this.form.getBoundingClientRect();
    const totalHeight = formRect.height;

    this.form.style.transition = 'opacity 250ms';
    this.form.style.opacity = '0';
    this.chartDiv.style.transition = '';

    window.setTimeout(() => {
      this.form.style.display = 'none';
      this.chartDiv.style.transform = `translateY(${totalHeight}px)`;
    }, 250);

    window.setTimeout(() => {
      this.chartDiv.style.transition = 'transform 250ms';
      this.chartDiv.style.transform = '';
    }, 350);

    window.setTimeout(() => {
      localStorage.setItem(`LiveVote_hasVoted_${this.id}`, 'true');
      this.hasVoted = true;
      this.setState({
        form: null
      });
    }, 250);
  }

  getOptionsDOM = options => {
    if (options) {
      const optionKeys = Object.keys(options);
      return optionKeys.map(key => {
        return (
          <div class={`${styles.formField} mdc-form-field`}>
            <div
              class="mdc-radio"
            >
              <input class="mdc-radio__native-control" type="radio" id={`vote-${key}`} name="radios" />
              <div class="mdc-radio__background">
                <div class="mdc-radio__outer-circle"></div>
                <div class="mdc-radio__inner-circle"></div>
              </div>
            </div>
            <label htmlFor={`vote-${key}`}>{key}</label>
          </div>
        );
      });
    }
  }

  getForm = options => {
    if (!this.hasVoted) {
      return (
        <form
          action="javascript:void(0)"
          onSubmit={this.onSubmit}
          ref={form => this.form = form}
        >
          <div id="viewPollOptions">
            {this.getOptionsDOM(options)}
          </div>
          <button
            class={`${styles.submit} mdc-button mdc-button--raised mdc-button--accent`}
            type="submit"
            ref={btn => this.submitButton = btn}
          >
            Vote
          </button>
        </form>
      );
    }

    return null;
  }

  componentDidMount = () => {
    window.scrollTo(0, 0);

    readAtPath(`/polls/${this.id}`, 'value', snapshot => {
      const value = snapshot.val();
      this.setState({
        name: value.name,
        desc: value.desc,
        options: value.options,
        form: this.getForm(value.options)
      });
    });
  }

  componentDidUpdate = () => {
    if (this.form) {
      const interval = window.setInterval(() => {
        if (this.hasVoted) window.clearInterval(interval);
        const pos = getComputedStyle(this.submitButton).position;
        if (pos === 'relative') {
          ripple.MDCRipple.attachTo(this.submitButton);
          window.clearInterval(interval);
        }
      }, 250);
    }
  }

  render = ({pollId}, {name, desc, options, form}) => {
    if (this.id !== pollId) {
      this.id = pollId;
      this.hasVoted = localStorage.getItem(`LiveVote_hasVoted_${this.id}`) ? true : false;
    }

    return (
      <div>
        <div class={`${styles.card} mdc-card`}>
          <section class="mdc-card__primary">
            <h1 class="mdc-card__title mdc-card__title--large">{name}</h1>
          </section>
          <section class="mdc-card__supporting-text">
            {form}
            <div
              class={styles.chartArea}
              ref={chartDiv => this.chartDiv = chartDiv}
            >
              <PollChart options={options} />
            </div>
          </section>
        </div>

        <div class={`${styles.card} mdc-card`}>
          <section class="mdc-card__primary">
            <h1 class="mdc-card__title">Description</h1>
          </section>
          <section class="mdc-card__supporting-text">{desc}</section>
        </div>
      </div>
    );
  }
}
