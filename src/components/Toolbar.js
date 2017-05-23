import {h, Component} from 'preact';
import Match from 'preact-router/match';
import styles from 'styles/Toolbar.scss';

export default class extends Component {
  state = {
    type: 'default',
    title: 'Explore'
  }

  getMenuStyles = () => {
    if (this.state.type === 'viewPoll') {
      return {
        display: 'none'
      };
    }

    return {
      display: 'inline-block'
    };
  }

  getBackStyles = () => {
    if (this.state.type === 'viewPoll') {
      return {
        display: 'inline-block'
      };
    }

    return {
      display: 'none'
    };
  }

  getSearchStyles = () => {
    if (this.state.type === 'create' || this.state.type === 'viewPoll') {
      return {
        display: 'none'
      };
    }

    return {
      display: 'inline-block'
    };
  }

  getTitle = () => {
    return this.state.title ? this.state.title : '';
  }

  componentDidMount = () => {
    this.setState({});
  }

  render = ({toolbarRef}, state) => {
    return (
      <header
        class="mdc-toolbar mdc-toolbar--fixed mdc-toolbar--waterfall"
        ref={toolbarRef}
      >
        <Match path="/">
          {({matches, url, path}) => {
            if (matches) {
              this.setState({
                type: 'default',
                title: 'Explore'
              });
            }
          }}
        </Match>
        <Match path="/create">
          {({matches, url, path}) => {
            if (matches) {
              this.setState({
                type: 'create',
                title: 'Create'
              });
            }
          }}
        </Match>
        <Match path="/view">
          {({matches, url, path}) => {
            if (path.indexOf('view') === 1) {
              this.setState({
                type: 'viewPoll',
                title: 'View Poll'
              });
            }
          }}
        </Match>
        <div class="mdc-toolbar__row">
          <section class="mdc-toolbar__section mdc-toolbar__section--align-start">
            <button id="menu" class={`${styles.toolbarButton} mdc-theme--text-primary-on-primary material-icons`} style={this.getMenuStyles()}>menu</button>
            <a href="/" class={`${styles.toolbarButton} mdc-theme--text-primary-on-primary material-icons`} style={this.getBackStyles()}>arrow_back</a>
            <span class="mdc-toolbar__title">{this.getTitle()}</span>
          </section>
          <section class="mdc-toolbar__section mdc-toolbar__section--align-end">
            <button id="search" class={`${styles.toolbarButton} mdc-theme--text-primary-on-primary material-icons`} style={this.getSearchStyles()}>search</button>
          </section>
        </div>
      </header>
    );
  }
}
