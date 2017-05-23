import {h, Component} from 'preact';
import Drawer from 'components/Drawer';
import Toolbar from 'components/Toolbar';
import {toolbar} from 'material-components-web';
import styles from 'styles/body.scss';

export default class extends Component {
  componentDidMount = () => {
    this.toolbar = toolbar.MDCToolbar.attachTo(this.toolbarRef);
    this.toolbar.fixedAdjustElement = this.main;
  }

  render = () => {
    return (
      <div class={`${styles.body} mdc-typography`}>
        <Toolbar toolbarRef={toolbar => this.toolbarRef = toolbar} />
        <Drawer title="Live Vote" />
        <main
          class={`${styles.main} mdc-toolbar-fixed-adjust`}
          ref={main => this.main = main}
        >
          {this.props.children}
        </main>
      </div>
    );
  }
}
