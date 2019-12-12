import React from 'react';
import { Switch, Route } from "react-router-dom";

import Docs from './docs';


class Content extends React.Component {
    constructor(props){
      super(props);
      this.state = {
        link:null
      }
    }

    render(){
        return (
          <div>
            <Switch>
              <Route path="/docs">
                <Docs waw={this.props['link']}/>
              </Route>
              <Route path="/users">
                <Users />
              </Route>
              <Route path="/">
                <Home />
              </Route>
            </Switch>
          </div>
      );
    }
  }
  
  function Home() {
    return <h2>Home</h2>;
  }
  
  
  
  function Users() {
    return <h2>Users</h2>;
  }

  export default Content;