import React from 'react';
import {BrowserRouter as Router} from 'react-router-dom';
import './App.css';

import Menu from './left/menu';
import Content from './rigth/content';
import {makeid} from './utils'

class App extends React.Component {

  constructor(){
    super();
    this.state = {
      link:null
    }
  }

  tampilin(data){
    this.setState({
      link:data
    })
  }
  
  render(){

      let env_avalaibe = JSON.parse(window.localStorage.getItem('var_env'));
      let env_var = [];

      if(env_avalaibe){
        for(let key in env_avalaibe){
          let id=`var_env_${key}`
          let makeid_ = makeid(5)
          env_var.push(
          <tr id={makeid_} key={key}>
            <td style={{minWidth:'130px'}}>{key}</td>
            <td>
              <input 
                id={id}
                style={{padding: '5px'}}
                // value={env_avalaibe[key]} 
                onChange={
                  ()=>{}
                }/>
            </td>
            <td 
              onClick={()=>{
                let temp_env = JSON.parse(window.localStorage.getItem('var_env'))
                delete temp_env[key]
                window.localStorage.setItem('var_env', JSON.stringify(temp_env));
                document.getElementById(makeid_).remove()
              }}>
              <span className="btnHapusEnv">hapus</span></td>
          </tr>
          )
          if(document.getElementById(id)){
            let element = document.getElementById(id);
            element.value = env_avalaibe[key]
            element.addEventListener('input', (e)=>{
              env_avalaibe[key] = e.target.value
            })
            
          }
        }
      }
      env_var = <>
      <table><tbody id="list_env">{env_var}</tbody></table>
      <table>
        <tbody> 
          <tr key="save">
          <td>
            <button
              onClick={()=>{ 
                let id = makeid(5)
                let tbody = document.getElementById('list_env');
                let newRow   = tbody.insertRow();
                let fisrt  = newRow.insertCell(0);
                let second  = newRow.insertCell(1);
                let third  = newRow.insertCell(2);
                var fieldName = document.createElement("input");
                fieldName.type = 'text';
                fieldName.style.padding = '5px';
                fieldName.addEventListener('input', (e)=>{
                  
                })
                var fieldValue = document.createElement("input");
                fieldValue.type = 'text';
                fieldValue.style.padding = '5px';
                fieldValue.addEventListener('input', ()=>{
                  
                })
                var saveBtn = document.createElement("span");
                saveBtn.innerText = "save"
                saveBtn.style.background = 'green'
                saveBtn.style.padding = '5px'
                saveBtn.style.color = 'cornsilk';
                saveBtn.style.paddingRight = '11px';
                saveBtn.style.paddingLeft = '10px';
                saveBtn.style.cursor = 'pointer';
                saveBtn.addEventListener('click', ()=>{
                  if(!window.localStorage.getItem('var_env')){
                    window.localStorage.setItem('var_env', JSON.stringify({}));  
                  }
                  let temp_env = JSON.parse(window.localStorage.getItem('var_env'))
                  temp_env[fieldName.value] = fieldValue.value
                  if (fieldName.value !=='' && fieldValue.value !== ''){
                    window.localStorage.setItem('var_env', JSON.stringify(temp_env));
                    saveBtn.innerText = "hapus"
                    saveBtn.classList.add('btnHapusEnv')
                    saveBtn.addEventListener('click', ()=>{
                      let temp_env = JSON.parse(window.localStorage.getItem('var_env'))
                      delete temp_env[fieldName.value]
                      window.localStorage.setItem('var_env', JSON.stringify(temp_env));
                      newRow.remove()
                    })
                  }
                })
                fisrt.appendChild(fieldName);
                second.appendChild(fieldValue);
                third.appendChild(saveBtn)
                // console.log(env_avalaibe)

                // var textfield = document.createElement("input");
                // textfield.type = "text";
                // document.getElementById('form').appendChild(textfield);
                // env_var.push(
                //   <tr key="save">
                //     <td>
                //       <input/>
                //     </td>
                //     <td>
                //       <input/>
                //     </td>
                //   </tr>
                //   )
              }}
              >tambah</button>
          </td>
          <td>
            {/* <button
            onClick={()=>{ 
              let new_value = JSON.stringify(env_avalaibe);
              // window.localStorage.setItem('var_env', new_value);
              console.log(env_avalaibe)
              document.getElementById('modal').style.display = 'none'
            }}
            >save</button> */}
          </td>
          </tr>
        </tbody>
      </table></>


      return (
        <Router>
        <div className="flexMenu">
          <Menu tampilkan={(link) => {this.tampilin(link)}}/>
          <Content link={this.state.link}/>
        </div>
        <div 
          id="modal"
          style={{position: 'absolute', background: '#403838bf',top: '0px', width: '211vh', height: '100vh', display:'none'}}>
            <div 
            style={{
              background: 'rgba(241, 241, 241, 0.75)', 
              width: '144vh', 
              height: '40vh', 
              position: 'absolute', 
              left: '26vh', 
              top: '21vh', 
              padding: '18px', 
              borderRadius: '10px',
              overflowY:'scroll'}}>
              {env_var}
            </div>
            <span
              style={{
                position:'absolute', 
                top: '18vh', 
                left: '22vh', 
                background: 'palevioletred', 
                padding: '5px', 
                color: 'white', 
                borderRadius: '4px',
                cursor:'pointer'}}
              onClick={()=>{
                document.getElementById('modal').style.display = 'none'
              }}
              >
              close
            </span>
        </div>
        </Router>
      )
  }
}

export default App;
