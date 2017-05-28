import {h, Component} from 'preact';
import Match from 'preact-router/match';
import styles from 'styles/Footer.scss';

export default class extends Component {
  getFooterStyles = () => {
    if (this.state.show === false) {
      return {
        display: 'none'
      }
    }

    return {};
  }

  render = () => {
    return (
      <footer class={styles.footer} style={this.getFooterStyles()}>
        <Match path="/welcome">
          {({matches, url, path}) => {
            if (matches) {
              this.setState({
                show: false
              });
            } else {
              this.setState({
                show: true
              });
            }
          }}
        </Match>
        Developed by Amandus Thorsrud.
      </footer>
    );
  }
}
