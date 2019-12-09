import React from 'react';
import axios from 'axios';
import {Link} from 'react-router-dom';

const BASE_URL_MENU = 'http://192.168.8.102:9009';
class Menu extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            data : null,
            link : null
        }
    }

    componentDidMount(){
        axios.get(`${BASE_URL_MENU}/menu`)
        .then(res => {
            this.setState({
                data : res.data.data
            })
        })
    }

    gantimenu(file_name){
        axios.get(`${BASE_URL_MENU}/docs?part=${file_name}`)
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
                  file_name = file_name.split(' ').join('_')
                  resutl.push(
                    <li key={key}>
                        <Link style={{textTransform: 'capitalize'}} onClick={()=>this.gantimenu(file_name)} to={'docs#' + this.state.data[key]}>{this.state.data[key]}</Link>
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