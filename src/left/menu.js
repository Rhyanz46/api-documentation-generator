import React from 'react';
import axios from 'axios';
import {Link} from 'react-router-dom';

// const BASE_URL_MENU = 'http://192.168.8.107:9009';
const BASE_URL_MENU = 'http://localhost:9009';
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
                // console.log(typeof(this.state.data[key]))
                let type = typeof(this.state.data[key])
                if(type === 'string'){
                  let file_name = `${key}_${this.state.data[key]}`;
                  let link_a = file_name.split(' ').join('_')
                  resutl.push(
                    <Link 
                        key={key}
                        style={{textTransform: 'capitalize'}} 
                        onClick={()=>this.gantimenu(link_a)} 
                        to={'docs#' + this.state.data[key] + "dad"}>
                            <li className="list-menu" >
                                {this.state.data[key]}
                            </li>
                    </Link>
                  )
                }else if(type === 'object'){
                    let file_name = `${key}_${this.state.data[key].nama}`
                    let link_a = file_name.split(' ').join('_')
                    let link_sub = [];
                    for(let keyy in this.state.data[key].sub){
                        let file_name_sub = `${keyy}_${this.state.data[key].sub[keyy]}`
                        let link_b = link_a + '/' +file_name_sub.split(' ').join('_')
                        link_sub.push(
                            <Link 
                                key={keyy}
                                style={{textTransform: 'capitalize'}} 
                                onClick={()=>this.gantimenu(link_b)} 
                                to={`docs#${this.state.data[key].sub[keyy]}`}>
                                    <li className="list-menu" >
                                       {this.state.data[key].sub[keyy]}
                                    </li>
                            </Link>
                        )
                    }
                    resutl.push(
                        <li key={key} className="list-menu" style={{textTransform: 'capitalize'}}>
                            {this.state.data[key].nama}
                            <ul>
                                {link_sub}
                            </ul>
                        </li>
                    )
                }
            }
            return (
                <div>
                    {
                    <nav style={{position:'absolute'}}>
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