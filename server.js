const fs = require('fs');
const path = require('path');

const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const app = express();

app.use(express.json());
app.use(morgan('dev'));
app.use(cors());

function GetFileS(folder, only=null){
    let data = [];
    fs.readdirSync(folder).forEach(file => {
        let file_add = `${folder}/${file}`
        let is_dir = fs.lstatSync(file_add).isDirectory()
        let is_file = fs.lstatSync(file_add).isFile()
        if(is_file){
            if(only){
                let re = /(?:\.([^.]+))?$/;
                let extension = re.exec(file)[0]
                if(extension === only){
                    data.push({'nama': file, type:'file'})
                }
            }else{
                data.push({'nama': file, type:'file'})
            }
        }else if(is_dir){
            data.push({'nama': file, type:'folder'})
        }
    })
    return data;
}

function SubMenu(data, folder_sekarang, folder_dalamnya){
    let result = {};
    for(let item in data){
        try{
            let menu = data[item]['nama'].split('_');
            let nomor = menu.shift(); // memindahkan index pertama ke dalam variabel nomor
            if(Number.isNaN(Number(nomor))){
                let MakeError = new Error()
                MakeError()
            }   
            menu = menu.join(' ').split('.')[0]
            if (data[item]['type'] == 'file'){
                result[nomor]=menu
            }
            // else if(data[item]['type'] == 'folder'){
            //     let re_dir = /(?:\/([^/]+))?$/;
            //     let folder_add = `${folder_sekarang}/${folder_dalamnya}/${data[item]['nama']}`
            //     let folder_dalam = re_dir.exec(folder_add)[1]
            //     let datadir = GetFileS(folder_add, only=".json");
            //     let wawww = SubMenu(datadir, folder_add, folder_dalam);
            //     result[nomor]={nama: menu, sub: ""}
            // }
        }catch(e){}
    }
    return result;
}

function Menu(data, folder_sekarang, folder_dalamnya){
    let result = {};
    for(let item in data){
        try{
            let menu = data[item]['nama'].split('_');
            let nomor = menu.shift(); // memindahkan index pertama ke dalam variabel nomor
            if(Number.isNaN(Number(nomor))){
                let MakeError = new Error()
                MakeError()
            }   
            menu = menu.join(' ').split('.')[0]
            if (data[item]['type'] == 'file'){
                result[nomor]=menu
            }else if(data[item]['type'] == 'folder'){
                let re_dir = /(?:\/([^/]+))?$/;
                let folder_add = `${folder_sekarang}/${folder_dalamnya}/${data[item]['nama']}`
                let folder_dalam = re_dir.exec(folder_add)[1]
                let datadir = GetFileS(folder_add, only=".json");
                let wawww = SubMenu(datadir, folder_add, folder_dalam);
                result[nomor]={nama: menu, sub: wawww}
            }
        }catch(e){}
    }
    return result;
}

app.get('/menu', (_req, res) => {
    let folder = 'data';
    let folder_add = path.resolve() + `/${folder}`;
    let datadir = GetFileS(folder_add, only=".json");
    let data = Menu(datadir, path.resolve(), folder)
    if (Object.keys(data).length == 0){
        data['message'] ='empty'
    }
    res.json({data:data})
})



app.get('/docs', (req, res) => {
    let part = req.query['part'];
    if(part){
        let file_add = path.resolve() + "/data/" + part + ".json";
        let content;
        try{
            let is_file = fs.lstatSync(file_add).isFile()
            if(is_file){
                data = file_add
                content = fs.readFileSync(file_add).toString()
            }else{
                let MakeError = new Error()
                MakeError()
            }
        }catch(e){
            res.json({message:"tidak ada file"})
        }

        try{
            let json_content = JSON.parse(content);
            res.json({data:json_content})
        }catch(e){
            res.json({message:"format json tidak sesuai"})
        }
    }else{
        console.log("gk ada")
        res.json({message:"data is invalid"})
    }
})

app.listen(9009, () => {
    console.log("Running at : http://localhost:9009")
})