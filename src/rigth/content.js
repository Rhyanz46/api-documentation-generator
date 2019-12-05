import React from 'react';
import {Switch,Route} from "react-router-dom";
import axios from 'axios';


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
                {/* <div>
                  mantap baru ini guys {this.props['link']}
                </div> */}
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
  
  class Docs extends React.Component{
    constructor(props){
      super(props);
      console.log(props)
      this.state ={
        data_from_api:null,
        endpoint: null,
        method:null,
        example:null
      }
    }

    componentWillReceiveProps(props){
      let data = props.waw;
      if(data){
        // console.log(data['endpoint'])
        this.setState({
          data_from_api:props.waw,
          endpoint:data['endpoint']
        })
      }
    }

    request(data){
      axios.get("http://localhost:9009" + this.state.endpoint)
      .then(res=> {
        console.log(res)
      })
    }

    render(){
      let data = this.state.data_from_api;
      if(data){
        return (
          <div>
            {
              data['endpoint']
            }
            <button onClick={() => this.request("d")}>Send</button>
          </div>
        )
      }else{
        return (
          <div>
            Loading . . . .
          </div>
        )
      }
    }
  }
  
  function Users() {
    return <h2>Users</h2>;
  }

  export default Content;