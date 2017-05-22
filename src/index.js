import {render, h} from 'preact';
import Router from 'preact-router';
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

const loading = () => <h1>Loading...</h1>;

const App = () => (
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
        default
        type="404"
        component={get404}
        loading={loading}
      />
    </Router>
  </Body>
);

render(<App />, root);
