import { Auth } from 'aws-amplify'
import React, {Component, Fragment} from 'react';
import { Link, withRouter } from "react-router-dom";
import { Nav, Navbar } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import './App.css';
import Routes from "./Routes";

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isAuthenticated: false,
      isAuthenticating: true
    };
  }

  async componentDidMount() {
    try {
      await Auth.currentSession();
      this.userHasAuthenticated(true);
    }
    catch(e) {
      if (e !== 'No current user') {
        alert(e);
      }
    }

    this.setState({ isAuthenticating: false });
  }

  userHasAuthenticated = authenticated => {
    this.setState({ isAuthenticated: authenticated });
  };

  handleLogout = async event => {
    if(event === "logout") {
      await Auth.signOut();

      this.userHasAuthenticated(false);

      this.props.history.push("/login");
    }
  };

  render() {
    const childProps = {
      isAuthenticated: this.state.isAuthenticated,
      userHasAuthenticated: this.userHasAuthenticated
    };

    return (
        !this.state.isAuthenticating &&
        <div className="App container">
          <Navbar fluid="true" collapseOnSelect bg="light" variant="light">
            <Navbar.Brand>
              <Link to="/" className="navbar-brand">Scratch</Link>
            </Navbar.Brand>
            <Navbar.Toggle/>
            <Navbar.Collapse className="justify-content-end">
              <Nav onSelect={k => this.handleLogout(k)}>
                {this.state.isAuthenticated
                    ? <Nav.Item>
                        <Nav.Link eventKey="logout">Logout</Nav.Link>
                      </Nav.Item>
                    : <Fragment>
                      <Nav.Item>
                        <LinkContainer to="/signup">
                          <Nav.Link>Signup</Nav.Link>
                        </LinkContainer>
                      </Nav.Item>
                      <Nav.Item>
                        <LinkContainer to="/login">
                          <Nav.Link>Login</Nav.Link>
                        </LinkContainer>
                      </Nav.Item>
                    </Fragment>
                    }
              </Nav>
            </Navbar.Collapse>
          </Navbar>
          <Routes childProps={childProps} />
        </div>
    )
  }
}

export default withRouter(App);