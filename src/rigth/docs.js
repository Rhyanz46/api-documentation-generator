import React from 'react';
import axios from 'axios';


class Docs extends React.Component{
    constructor(props){
      super(props);
      this.state ={
        data_from_api:null,
        data_to_send:null,
        index:0,
        temp_data:null,
        temp_method:null,
        title:null,
        desc:null,
        res_data:null
      }
    }

    componentWillReceiveProps(props){
      let data = props.waw;
      let add_method = [];
      if(Object.keys(data).includes('post')){
        add_method.push('post')
      }
      if(Object.keys(data).includes('get')){
        add_method.push('get')
      }
      this.setState({
        index:0,
        title:data['title'],
        desc:data['desc'],
        temp_method:add_method,
        data_from_api:props.waw,
        endpoint:data['endpoint'],
        res_data:null,
        temp_data:JSON.stringify(data[add_method[this.state.index]].example, undefined, 2)
      })
    }

    request(){
      let method = this.state.temp_method[this.state.index];
      let data = JSON.parse(this.state.temp_data);
      axios[method]("http://0.0.0.0:1435" + this.state.endpoint, data)
      .then(res=> {
        this.setState({
          res_data:JSON.stringify(res.data, undefined, 2)
        })
      })
      .catch(res=>{
          try {
            if(res.response['status'] === 405){
              this.setState({
                res_data:"method not allowed"
              })
            }
            if(res.response['status'] === 404){
              this.setState({
                res_data:"url tidak ada di server ini"
              })
            }
            if(res.response['status'] === 400){
              this.setState({
                res_data:"data tidak valid"
              })
            }
          } catch (error) {
            this.setState({
              res_data:"url or data is not valid"
            })
          }
      })
    }

    reset(){
      this.setState({
        res_data:null
      })
    }

    gantiValue(e, key){
      this.setState({
        [key]:e.target.value
      })
    }

    render(){
      let data = this.state.data_from_api;
      if(data){
        return (
          <div className="doc-container">
            <div className="header-swagger">
              <div>{this.state.temp_method[this.state.index]}</div>
              <div>{data['endpoint']}</div>
              {this.state.temp_method.length > 1 ? <button onClick={()=> 
              {
                if(this.state.index ===1){
                  this.setState({index:0})
                }else{
                  this.setState({index:1})
                }
              }
              }>ganti</button>: ''}
            </div>
            {
              this.state.title === this.state.desc ? '' : 
              <div className="judul-ket-doc">
                { this.state.title ? <h4>{this.state.title}</h4> : '' }
                { this.state.desc ? <p>{this.state.desc}</p> : '' }
              </div>
            }
            <div className="example-value-doc">
              <h4>example value</h4>
              <textarea
                rows="10" 
                value={this.state.temp_data}
                onChange={(e)=>this.gantiValue(e, 'temp_data')}>
              </textarea>
            </div>
            {
              this.state.res_data ? <div className="example-res-doc">
              <h4>example response</h4>
              <pre>
                {this.state.res_data}
              </pre>
            </div> : ''
            }
            <div className="doc-actions-doc">
              <button className="btn-send-doc" onClick={() => this.request()}>Send</button>
              <button className="btn-reset-doc" onClick={() => this.reset()}>Reset</button>
            </div>
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


  export default Docs;