import React from 'react';
import axios from 'axios';

// http://35.198.246.127:1435
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
        title:null,
        desc:null,
        res_show:'data',
        content_type: 'json',
        content_type_list:{
          'json' : {'Content-Type':'application/json'},
          'form' : {'Content-Type':'multipart/form-data'}
        },
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
        tab:'data',
        index:0,
        title:data['title'],
        desc:data['desc'],
        temp_method:add_method,
        data_from_api:props.waw,
        endpoint:data['endpoint'],
        res_data:null,
        headers:{},
        res_header:null,
        temp_data:JSON.stringify(data[add_method[this.state.index]].example, undefined, 2)
      })
    }

    request(){
      let method = this.state.temp_method[this.state.index];
      let data = JSON.parse(this.state.temp_data);
      axios[method](BASE_URL_BACKEND + this.state.endpoint, data)
      .then(res=> {
        this.setState({
          res_data:JSON.stringify(res.data, undefined, 2),
          res_header:JSON.stringify(res.headers, undefined, 2),
        })
      })
      .catch(res=>{
          try {
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
        res_data:null
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
        let content_type = data[this.state.temp_method[this.state.index]]['content_type']
        // let headers = []
        // let index =0 ;
        // this.state.temp_header.map(header => {
        //   let key = Object.keys(header)[0]
        //   let value = header[key]
        //   headers.push(
        //     <div className="header-field" key={key}>
        //       <input 
        //         type="text" 
        //         value={key}
        //         onChange={(e)=>{
        //           if(index>0){
        //             let temp = this.state.temp_header;
        //             let new_key = e.target.value
        //             let new_value = temp[index-1][key]
        //             let new_obj = {[new_key]: new_value}
        //             temp[index-1] = new_obj;
        //             this.setState({
        //               temp_header:temp
        //             })
        //           }
        //         }}/> 
        //       <input
        //         onChange={(e)=>{
        //           if(index>0){
        //             let temp = this.state.temp_header;
        //             temp[index-1][key] = e.target.value
        //             this.setState({
        //               temp_header:temp
        //             })
        //           }
        //         }}
        //         type="text" 
        //         value={value}/>
        //     </div>
        //   )
        //   index++;
        // })
        // headers.push(<div><button onClick={()=>{
        //   this.setState({temp_header: [...this.state.temp_header, {"":""}]})
        // }}>tambah</button></div>)
        let example_json = <textarea
          rows="10" 
          value={this.state.temp_data}
          onChange={(e)=>{
            this.gantiValue(e.target.value, 'temp_data')
          }}>
        </textarea>
        let example_form = [];
        if (content_type === 'form'){
          let data_parsed = JSON.parse(this.state.temp_data)
          for (var key in data_parsed){
            example_form.push(
              <tr key={key}><td style={{textTransform: 'capitalize'}}>{key}</td><td><input className="form-field" value={data_parsed[key]} name={key}/></td></tr>
            )
          }
          example_form = <table style={{width: '100%'}}>{example_form}</table>
        }
        let example_data = content_type === 'json' ? example_json : example_form;
        return (
          <React.Fragment>
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
              }
              }>{this.state.temp_method[this.state.index]}</div>
              <div>{data['endpoint']}</div>
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
                {/* <span 
                  onClick={
                    () => {
                      this.setState({tab:'header'})
                    }
                  }>
                  | set headers <span style={{textTransform:"none", color:"red"}}>(bug)</span>
                </span> */}
              </h4>
              {
                this.state.tab === "data" ? example_data : ''
              }
              {/* {this.state.tab === "header" ? headers : ''} */}
            </div>
            <div className="doc-actions">
              <button className="btn-send-doc" onClick={() => this.request()}>Send</button>
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