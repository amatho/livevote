import {render, h, Component} from 'preact';
import {Router, route} from 'preact-router';
import AsyncRoute from 'preact-async-route';
import {createHashHistory} from 'history';
import Body from 'components/Body';
import Explore from 'components/Explore';
import Create from 'components/Create';
import ViewPoll from 'components/ViewPoll';
import './material.mdcscss';

const root = document.getElementById('root');

function importComponent(name) {
  return System.import(`components/${name}`).then(module => module.default);
}

function get404() {
  return importComponent('NotFound');
}

function getWelcome() {
  return importComponent('Welcome');
}

const loading = () => <h1>Loading...</h1>;

class App extends Component {
  componentDidMount = () => {
    if (!localStorage.getItem('LiveVote_hasVisited')) {
      route('/welcome');
    }
  }

  render = () => {
    return (
      <Body>
        <Router history={createHashHistory()}>
          <Explore path="/" />
          <Create
            path="/create"
          />
          <ViewPoll
            path="/view/:pollId"
          />
          <AsyncRoute
            path="/welcome"
            component={getWelcome}
            loading={loading}
          />
          <AsyncRoute
            default
            type="404"
            component={get404}
            loading={loading}
          />
        </Router>
      </Body>
    );
  }
}

render(<App />, root);
