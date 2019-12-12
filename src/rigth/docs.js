import React from 'react';
import axios from 'axios';

const BASE_URL_BACKEND = "http://35.198.246.127:1435";

class Docs extends React.Component{
    constructor(props){
      super(props);
      this.state ={
        data_from_api:null,
        data_to_send:null,
        index:0,
        temp_data:null,
        temp_method:null,
        endpoint:null,
        title:null,
        desc:null,
        res_show:'data',
        content_type: 'json',
        content_type_list:{
          'json' : 'application/json',
          'form' : 'multipart/form-data'
        },
        headers:{},
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
      let content_type = data[add_method[this.state.index]].content_type.toLowerCase()
      if(content_type === 'json'){
        this.setState({
          temp_data:JSON.stringify(data[add_method[this.state.index]].example, undefined, 2),
          data_to_send:data[add_method[this.state.index]].example
        })
      }else if(content_type === 'form'){
        let new_data_to_send = new FormData();
        for(let key in data[add_method[this.state.index]].example){
          new_data_to_send.append([key], data[add_method[this.state.index]].example[key].value)
        }
        this.setState({
          temp_data:data[add_method[this.state.index]].example,
          data_to_send:new_data_to_send
        })
      }
      this.setState({
        tab:'data',
        index:0,
        title:data['title'],
        desc:data['desc'],
        temp_method:add_method,
        data_from_api:props.waw,
        endpoint:data['endpoint'],
        res_data:null,
        headers:{
          ...this.state.headers, 
          ...data[add_method[this.state.index]].header
        },
        res_header:null,
        content_type:this.state.content_type_list[content_type]
      })
    }

    request(){
      let method = this.state.temp_method[this.state.index];
      let content_type = { 'Content-Type': this.state.content_type }
      let headers = {...this.state.headers, ...content_type}

      let new_axios = axios.create({
        baseURL: BASE_URL_BACKEND,
        headers: headers
      });

      console.log(headers)
      new_axios[method](this.state.endpoint, this.state.data_to_send)
      .then(res=> {
        console.log(res)
        this.setState({
          res_data:JSON.stringify(res.data, undefined, 2),
          res_header:JSON.stringify(res.headers, undefined, 2),
        })
      })
      .catch(res=>{
          try {
            console.log(res.response)
            if(res.response['status'] === 405){
              this.setState({
                res_data:"method not allowed"
              })
            }
            else if(res.response['status'] === 404){
              this.setState({
                res_data:"url tidak ada di server ini"
              })
            }
            else if(res.response['status'] === 400){
              this.setState({
                res_data:JSON.stringify(res.response['data'], undefined, 2)
              })
            }
            else{
              this.setState({
                res_data:JSON.stringify(res.response.data, undefined, 2)
              })
            }
          } catch (error) {
            this.setState({
              res_data:`Access to XMLHttpRequest at '${BASE_URL_BACKEND + this.state.endpoint}' from origin 'http://localhost:3000' has been blocked by CORS policy: Response to preflight request doesn't pass access control check: It does not have HTTP ok status.`
            })
          }
      })
    }

    reset(){
      this.setState({
        res_data:null,
        res_header:null
      })
    }

    gantiValue(value, key){
      this.setState({
        [key]:value
      })
    }

    render(){
      let data = this.state.data_from_api;
      if(data){
        let data_seleted_const = this.state.data_from_api[this.state.temp_method[this.state.index]];
        let content_type = data_seleted_const.content_type;
        let example_json = <textarea
          rows="10" 
          value={this.state.temp_data}
          onChange={(e)=>{
            this.gantiValue(e.target.value, 'temp_data')
            this.gantiValue(e.target.value, 'data_to_send')
          }}>
        </textarea>
        let example_form = [];
        if (content_type === 'form'){
          for (var key in this.state.temp_data){
            let attr = {};
            attr['key'] = key
            attr['type'] = this.state.temp_data[key].type ? this.state.temp_data[key].type : 'text'
            example_form.push(
              <tr key={attr.key}>
                <td style={{textTransform: 'capitalize'}}>{attr.key}</td>
                <td>
                <input 
                  type={attr.type} 
                  className="form-field"
                  onChange={(e)=> {
                    let new_temp_data = {...this.state.temp_data}
                    let new_data_to_send = this.state.data_to_send
                    let new_value;
                    if(attr.type === 'text'){
                      new_value = e.target.value;
                    }else if(attr.type === 'file'){
                      new_value = e.target.files[0];
                    }
                    new_data_to_send.set([attr.key], new_value)
                    new_temp_data[attr.key].value = new_value
                    this.setState({temp_data:new_temp_data})
                    this.setState({data_to_send:new_data_to_send})
                  }}
                  value={attr.type === 'text' ? this.state.temp_data[attr.key].value : ''} 
                  name={attr.key}/>
                </td>
              </tr>
            )
          }
          example_form = <table style={{width: '100%'}}><tbody>{example_form}</tbody></table>
        }
        let headers = [];
        if(this.state.data_from_api[this.state.temp_method[this.state.index]].header){
          for(let header_key in this.state.headers){
            let attr = {}
            attr['key'] = header_key
            headers.push(<tr key={attr.key}>
              <td>{header_key}</td>
              <td>
                <input 
                  type='text' 
                  className="form-field"
                  value={this.state.headers[attr.key]}
                  onChange={
                    (e) => {
                      let content_type = { [attr.key]: e.target.value }
                      console.log(attr.key)
                      this.setState({
                        headers:{...this.state.headers, ...content_type}
                      })
                    }
                  }/>
              </td>
            </tr>)
          }
        headers = <table style={{width: '100%'}}><tbody>{headers}</tbody></table>
        }
        let example_data = content_type === 'json' ? example_json : example_form;
        return (
          <React.Fragment>
          <div id="field_token">Masukkan Token : <input type="text"/></div>
          <div className="doc-container">
            <div className="header-swagger">
              <div 
              style={{cursor:'pointer'}}
              onClick={()=> {
                if(this.state.temp_method.length > 1){
                  if(this.state.index ===1){
                    this.setState({index:0})
                  }else{
                    this.setState({index:1})
                  }
                }
              }}>
              {this.state.temp_method[this.state.index]}</div>
              <div>
                <input
                  className="endpoint-field"
                  value={this.state.endpoint}
                  onChange={
                    (e)=>{this.gantiValue(e.target.value, 'endpoint')}
                  }/>
              </div>
              {
                content_type ? 
                <div>
                  {content_type}
                </div>
                : '' 
              }
            </div>
            {
              this.state.title === this.state.desc ? '' : 
              <div className="judul-ket-doc">
                { this.state.title ? <h4>{this.state.title}</h4> : '' }
                { this.state.desc ? <p>{this.state.desc}</p> : '' }
              </div>
            }
            <div className="example-value-doc">
              <h4>
                <span 
                  onClick={
                    () => {
                      this.setState({tab:'data'})
                    }
                  }>
                  example data
                </span>
                <span 
                  onClick={
                    () => {
                      this.setState({tab:'header'})
                    }
                  }>
                  | set headers <span style={{textTransform:"none", color:"red"}}>(hot)</span>
                </span>
              </h4>
              {
                this.state.tab === "data" ? example_data : ''
              }
              {this.state.tab === "header" ? headers : ''}
            </div>
            <div className="doc-actions">
              <button className="btn-send-doc" onClick={() => this.request()}>Send {data_seleted_const.protect ? <span style={{color:'#190c0c'}}>(protected)</span> : ''}</button>
              <button className="btn-reset-doc" onClick={() => this.reset()}>Reset</button>
            </div>
          </div>
          <div className="res-container">
            <div className="example-res-doc">
              <h4>
                <span 
                  style={{color:'#9e4242', cursor:'pointer', marginRight:'10px'}}
                  onClick={()=> this.gantiValue('data', 'res_show')}>
                  data response 
                </span> 
                <span 
                  style={{cursor:'pointer'}}
                  onClick={()=> this.gantiValue('header', 'res_show')}>
                  header response
                </span>
              </h4>
              <pre className="doc-response">
                {
                  this.state.res_show === "data" ? 
                  this.state.res_data ? this.state.res_data : 'waiting for request, no data to show' 
                  : 
                  this.state.res_header ? this.state.res_header : 'waiting for request, no header data to show'
                }
              </pre>
            </div> 
          </div>
          </React.Fragment>
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