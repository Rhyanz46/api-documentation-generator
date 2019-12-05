import React from 'react';
import {BrowserRouter as Router} from 'react-router-dom';
import './App.css';

import Menu from './left/menu';
import Content from './rigth/content';

class App extends React.Component {

  constructor(){
    super();
    this.state = {
      link:null
    }
  }

  tampilin(link){
    this.setState({
      link:link
    })
  }
  
  render(){
      return (
        <Router>
        <div className="flexMenu">
          <Menu tampilkan={(link) => {this.tampilin(link)}}/>
          <Content link={this.state.link}/>
        </div>
        </Router>
      )
  }
}

export default App;
