import {h, Component} from 'preact';
import styles from 'styles/SearchBar.scss';

export default class extends Component {
  render = ({onInput, onBackClick, show}) => {
    if (show && this.input) {
      this.input.focus();
    }

    return (
      <div class={[styles.container, show ? styles.active : ''].join(' ')}>
        <button
          class={`${styles.backButton} material-icons`}
          onClick={onBackClick}
        >
          arrow_back
        </button>
        <span class={styles.spacer}></span>
        <input
          class={styles.input}
          type="text"
          onInput={onInput}
          placeholder="Search..."
          ref={input => this.input = input}
        />
      </div>
    );
  }
}
