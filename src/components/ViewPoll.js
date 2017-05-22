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
    const pollOptions = document.getElementById('viewPollOptions').querySelectorAll('.mdc-radio input');
    pollOptions.forEach(option => {
      if (option.checked) {
        const votedId = option.id.replace('vote-', '');
        const votePath = `/polls/${this.id}/options/${votedId}`;
        readAtPathOnce(votePath, 'value', snapshot => {
          setAtPath(votePath, snapshot.val() + 1);
        });
      }
    });
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

  componentDidMount = () => {
    readAtPath(`/polls/${this.id}`, 'value', snapshot => {
      const value = snapshot.val();
      this.setState({
        name: value.name,
        desc: value.desc,
        options: value.options
      });
    });

    const interval = window.setInterval(() => {
      const pos = getComputedStyle(this.submitButton).position;
      if (pos === 'relative') {
        ripple.MDCRipple.attachTo(this.submitButton);
        window.clearInterval(interval);
      }
    }, 250);
  }

  render = ({pollId}, {name, desc, options}) => {
    if (!this.id) this.id = pollId;

    return (
      <div>
        <div class={`${styles.card} mdc-card`}>
          <section class="mdc-card__primary">
            <h1 class="mdc-card__title mdc-card__title--large">{name}</h1>
          </section>
          <section class="mdc-card__supporting-text">
            <form action="javascript:void(0)" onSubmit={this.onSubmit}>
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
            <div>
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
