import {h, Component} from 'preact';
import {Link} from 'preact-router/match';
import {drawer} from 'material-components-web';

export default class extends Component {
  getTitle = (title) => {
    return title ? title : '';
  }

  getLinkArray = (links) => {
    if (links) {
      return links.map(link => {
        return (
          <Link
            class="mdc-list-item"
            activeClassName="mdc-temporary-drawer--selected"
            href={`/${link[0]}`}
          >
            {link[1]}
          </Link>
        );
      });
    }

    return [];
  }

  componentDidMount = () => {
    this.mdcDrawer = new drawer.MDCTemporaryDrawer(this.aside);
    document.getElementById('menu').addEventListener('click', () => this.mdcDrawer.open = true);
    window.addEventListener('hashchange', () => {
      window.setTimeout(() => this.mdcDrawer.open = false, 250);
    });
    this.setState({});
  }

  render = (props, state) => {
    return (
      <aside
        class="mdc-temporary-drawer"
        ref={aside => {
          this.aside = aside;
        }}>
        <nav class="mdc-temporary-drawer__drawer">
          <header class="mdc-temporary-drawer__header mdc-theme--primary-bg mdc-theme--text-primary-on-primary">
            <div class="mdc-temporary-drawer__header-content">
              {this.getTitle(props.title)}
            </div>
          </header>
          <nav class="mdc-temporary-drawer__content mdc-list">
            <Link
              class="mdc-list-item"
              activeClassName="mdc-temporary-drawer--selected"
              href="/"
            >
              <i class="material-icons mdc-list-item__start-detail">explore</i>Explore
            </Link>
            <Link
              class="mdc-list-item"
              activeClassName="mdc-temporary-drawer--selected"
              href="/create"
            >
              <i class="material-icons mdc-list-item__start-detail">create</i>Create
            </Link>
          </nav>
        </nav>
      </aside>
    );
  }
}
