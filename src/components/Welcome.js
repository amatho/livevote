import {h, Component} from 'preact';
import {route} from 'preact-router';
import {ripple} from 'material-components-web';
import styles from 'styles/Welcome.scss';

export default class extends Component {
  onClick = evt => {
    localStorage.setItem('LiveVote_hasVisited', 'true');
    route('/');
  }

  componentDidMount = () => {
    const interval = window.setInterval(() => {
      const pos = getComputedStyle(this.getStarted).position;
      if (pos === 'relative') {
        ripple.MDCRipple.attachTo(this.getStarted);
        window.clearInterval(interval);
      }
    }, 250);
  }

  render = () => (
    <div class={styles.container}>
      <div class={styles.logoContainer}>
        <img class={styles.logo} src="images/icons/icon-512x512.png" alt="Live Vote Logo" />
      </div>
      <button
        class={`${styles.button} mdc-button mdc-button--primary`}
        ref={button => this.getStarted = button}
        onClick={this.onClick}
      >
        Get Started
      </button>
    </div>
  );
};
