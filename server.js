const fs = require('fs');
const path = require('path');

const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const app = express();

app.use(express.json());
app.use(morgan('dev'));
app.use(cors());

// function LsDir(folder){
//     let result = [];
//     fs.readdirSync('./data').forEach(file => {
//         let file_add = path.resolve() + "/data/" + file;
//         let is_dir = fs.lstatSync(file_add).isDirectory()
//         let is_file = fs.lstatSync(file_add).isFile()
//         if(is_file){
//             try{
//                 let menu = file.split('_');
//                 let nomor = menu.shift(); // memindahkan index pertama ke dalam variabel nomor
//                 if(Number.isNaN(Number(nomor))){
//                     let MakeError = new Error()
//                     MakeError()
//                 }   
//                 menu = menu.join(' ').split('.')[0]
//                 data[nomor]=menu
//             }catch(e){}
//         }
//         if(is_dir){
//             console.log(file.split('_').join(' '))
//         }
//     })
//     return result;
// }

app.get('/menu', (req, res) => {
    let data = {};
    fs.readdirSync('./data').forEach(file => {
        let file_add = path.resolve() + "/data/" + file;
        let is_dir = fs.lstatSync(file_add).isDirectory()
        let is_file = fs.lstatSync(file_add).isFile()
        if(is_file){
            try{
                let menu = file.split('_');
                let nomor = menu.shift(); // memindahkan index pertama ke dalam variabel nomor
                if(Number.isNaN(Number(nomor))){
                    let MakeError = new Error()
                    MakeError()
                }   
                menu = menu.join(' ').split('.')[0]
                data[nomor]=menu
            }catch(e){}
        }
        if(is_dir){
            console.log(file.split('_').join(' '))
        }
    })
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