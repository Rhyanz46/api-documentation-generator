import React from 'react';
import axios from 'axios';
import {Link} from 'react-router-dom';

class Menu extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            data : null,
            link : null
        }
    }

    componentDidMount(){
        axios.get('http://localhost:9009/menu')
        .then(res => {
            this.setState({
                data : res.data.data
            })
        })
    }

    gantimenu(file_name){
        axios.get(`http://localhost:9009/docs?part=${file_name}`)
        .then(res => {
            this.props.tampilkan(res.data.data);
        })
    }

    render() {
        if (this.state.data){
            let resutl = [];
            for (let key in this.state.data){
                if(this.state.data.hasOwnProperty(key)){
                  let file_name = `${key}_${this.state.data[key]}`;
                  resutl.push(
                    <li key={key}>
                        <Link onClick={()=>this.gantimenu(file_name)} to={'docs#' + this.state.data[key]}>{this.state.data[key]}</Link>
                    </li>
                  )
                }
            }
            return (
                <div>
                    {
                    <nav>
                        <ul>
                            {
                                resutl.map(listitem => (
                                    listitem
                                ))
                            }
                        </ul>
                    </nav>
                    }
                </div>
            )
        }else{
            return (
                <div>Loading...</div>
            )
        }
    }
}

export default Menu;