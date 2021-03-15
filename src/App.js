import { Route, BrowserRouter as Router, Switch } from 'react-router-dom';

import UsersList from './components/users-list/UsersList';
import AddUser from './components/add-user/AddUser';

const App = () => {
  return (
    <>
      <header
        onClick={() => (window.location.href = '/')}
        style={{ cursor: 'pointer' }}
      >
        Users Management System
      </header>
      <Router>
        <Switch>
          <Route exact path='/add-user' component={AddUser} />
          <Route exact path='/edit-user/:id' component={AddUser} />
          <Route exact path='/' component={UsersList} />
        </Switch>
      </Router>
    </>
  );
};

export default App;
