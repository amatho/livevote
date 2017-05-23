import {h, Component} from 'preact';
import Drawer from 'components/Drawer';
import Toolbar from 'components/Toolbar';
import styles from 'styles/body.scss';

export default class extends Component {
  getLinks = () => {
    return [
      ['', 'Explore'],
      ['create', 'Create']
    ];
  }

  render = () => {
    return (
      <div class={`${styles.body} mdc-typography`}>
        <Toolbar />
        <Drawer title="Live Vote" links={this.getLinks()} />
        <main class={styles.main}>
          {this.props.children}
        </main>
      </div>
    );
  }
}
