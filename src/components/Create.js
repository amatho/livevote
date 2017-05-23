import {h, Component} from 'preact';
import {route} from 'preact-router';
import {autoInit} from 'material-components-web';
import {pushAtPath} from 'services/firebase';
import styles from 'styles/Create.scss';

const OptionInputs = ({amount, optionsDivRef}) => {
  function generate(amt, index, acc) {
    const i = index ? index : 1;
    let a = [];
    if (acc) {
      a = acc;
    }
    const option = (
      <div class={styles.textfield}>
        <label class={`${styles.input} mdc-textfield`} data-mdc-auto-init="MDCTextfield">
          <input type="text" class="mdc-textfield__input" required={i === 1 || i === 2} />
          <span class="mdc-textfield__label">Option {i}</span>
        </label>
      </div>
    );

    if (index > amt) {
      return a;
    }

    return generate(amt, i + 1, a.concat([option]));
  }

  return (
    <div ref={optionsDivRef}>
      {generate(amount)}
    </div>
  );
}

export default class extends Component {
  state = {
    options: 2
  }

  onSubmit = evt => {
    evt.preventDefault();

    if (!evt.target.elements.name.value || !evt.target.elements.desc.value) {
      return;
    }

    const name = evt.target.elements.name.value;
    const desc = evt.target.elements.desc.value;
    const options = {};
    const optionElements = Array.prototype.slice.call(this.optionsDiv.children);

    optionElements.forEach(option => {
      const input = option.querySelector('.mdc-textfield .mdc-textfield__input');
      if (input.value) {
        options[input.value] = 0;
      }
    });

    pushAtPath('/polls', {
      name,
      desc,
      options
    });

    evt.target.elements.name.value = '';
    evt.target.elements.desc.value = '';

    optionElements.forEach(option => {
      const input = option.querySelector('.mdc-textfield .mdc-textfield__input');
      input.value = '';
    });

    this.setState({
      options: 2
    });

    route('/');
  }

  addOption = evt => {
    evt.preventDefault();
    this.setState({
      options: this.state.options + 1
    });
  }

  componentDidUpdate = () => {
    autoInit(this.optionsDiv);
  }

  componentDidMount = () => {
    autoInit(this.section);
  }

  render = ({}, {options}) => {
    return (
      <div class={`${styles.card} mdc-card`}>
        <section
          class="mdc-card__supporting-text"
          ref={section => this.section = section}
        >
          <form action="javascript:void(0)" onSubmit={this.onSubmit}>
            <div class={styles.textfield}>
              <label class={`${styles.input} mdc-textfield`} data-mdc-auto-init="MDCTextfield">
                <input type="text" class="mdc-textfield__input" name="name" required />
                <span class="mdc-textfield__label">Title</span>
              </label>
            </div>

            <div class={styles.textfield}>
              <label class={`${styles.input} mdc-textfield mdc-textfield--multiline`} data-mdc-auto-init="MDCTextfield">
                <textarea type="text" class="mdc-textfield__input" rows="4" name="desc" required />
                <span class="mdc-textfield__label">Description</span>
              </label>
            </div>

            <div class={styles.spacer}></div>

            <OptionInputs
              amount={options}
              optionsDivRef={optionsDiv => this.optionsDiv = optionsDiv}
            />
            <div class={styles.buttonContainer}>
              <button
                class={`${styles.button} mdc-button mdc-button--raised mdc-button--accent`}
                type="submit"
              >
                Submit
              </button>
              <button
                class={`${styles.button} mdc-button mdc-button--raised mdc-button--primary`}
                onClick={this.addOption}
              >
                Add an option
              </button>
            </div>
          </form>
        </section>
      </div>
    );
  }
}
