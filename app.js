const express = require('express');
const body = require('body-parser');
const session = require('express-session');
const multiparty = require('multiparty');
const mongoose = require('mongoose');
const fs = require('fs');
const md5 = require('md5');
const app = express();


app.set('view engine','ejs')
let {db,dbfind} = require('./db/connectdb');
let db_users_info = require('./db/userCurd');
let db_product_info = require('./db/productCurd');



app.use(express.static(__dirname+'/lib'));
app.use(express.static(__dirname+'/static'));
app.use(express.static(__dirname+'/upload'));
app.use(body({extended:true}));
app.use(session({
    name:'username',
    secret:'过法国恢复恢复供货方',
    resave:true,
    saveUninitialized:true,
    cookie:{
        maxAge:9000000
    },
    rolling:false
}))
app.use(body.json());


app.use((req,res,next)=>{
    if(req.url == '/'||req.url == '/register' ||req.url == '/doCheckName' || req.url == '/login' || req.url == '/doLogin' || req.url =='/doRegister'){
        if(req.session.username){
            res.redirect('/personal');
        }else{
            next();
        }
    }else{
        if(req.session.username){
            app.locals['username'] = req.session.username;
            next();
        }else{
            res.redirect('/')
        }
    }
})


app.get('/',(req,res)=>{
    console.log(req.session.username);
    res.render('index',{
        username:req.session.username
    });
});
app.get('/register',(req,res)=>{
    console.log(6);
    res.render('register',{
        username:req.session.username
    });
});
app.get('/personal',(req,res)=>{
    res.render('personal')
})


app.post('/doLogin',async (req,res)=>{
    let obj = {
        username:req.body.username,
        pwd:md5(req.body.pwd),
    };
    let result =await db_users_info.loginRegister(obj)
    // console.log(result);
    if(result.msg != 0){
        // console.log(obj.username);
        req.session.username = obj.username;
    }
    res.send(result);
});
app.post('/doRegister',async (req,res)=>{
    let obj = {
        username:req.body.username,
        pwd:md5(req.body.pwd),
        age:Number(req.body.age),
        nickname:req.body.nickname,
        img:req.body.img
    };
    let result =await db_users_info.insertdb(obj);
    // console.log(result);
    
    res.send(result);
});

app.post('/doCheckName',async (req,res)=>{
    // console.log(req.body)
    let result = await db_users_info.findname(req.body);
    res.send(result);
});

app.get('/getUserInfo',async (req,res)=>{
    let username = req.session.username;
    // console.log(username)
    let result = await db_users_info.getUserInfo(username)
    // console.log();
    res.send(result);

})
app.post('/updateInfo',async (req,res)=>{
    console.log(req.body)
    let username = req.session.username;
    let {pwd} = req.body;
    let newobj = {
        username:username,
        pwd:md5(pwd)
    }
    let newobj1 = {
        nickname:req.body.nickname,
        newpwd:md5(req.body.newpwd),
        age:req.body.age
    }
    // console.log(newobj1)
    let result1 = await db_users_info.loginRegister(newobj);
    // console.log(result1);
    if(result1.msg == 0){
        res.send({err:1,msg:false});
    }else if(result1.msg == 1){
        let result2 = await db_users_info.updateInfo(username,newobj1);
        // console.log(result2)
        res.send(result2);
    }
})
app.post('/updateImg',(req,res)=>{
    let form =new multiparty.Form({
        uploadDir:'./upload'
    });
    form.parse(req,async (err,fileds,files)=>{
        console.log(files);
        let img = files.user_img[0].path;
        let username = req.session.username;
        let result = await db_users_info.updateImg(img,username);
        if(result.msg){
            res.send("<script> alert('添加成功'); location.href = 'http://localhost:8890/personal' </script>")
        }
    })
})




app.get('/addProdunt',(req,res)=>{
    res.render('addProdunt');
})
app.get('/viewProdunt',(req,res)=>{
    res.render('viewProdunt');
})


app.post('/doAddProdunt',(req,res)=>{
    let form =new multiparty.Form({
        uploadDir:'./upload'
    });
    form.parse(req,async (err,fileds,files)=>{
        // console.log(fileds);
        // console.log(files);
        let obj = {
            pro_name:fileds.pro_name[0],
            pro_price:Number(fileds.pro_price[0]),
            pro_num:Number(fileds.pro_num[0]),
            pro_shelf:fileds.pro_shlef[0],
            pro_img:files.pro_img[0].path
        }
        console.log(obj)
        let result = await db_product_info.addProductInfo(obj);
        // console.log(result);
        if(result.msg){
            res.send("<script> alert('添加成功'); location.href = 'http://localhost:8890/addProdunt' </script>");
        }else{
            res.send("<script> alert('添加失败'); </script>");
        }
    });
})
app.post('/getProductInfo', async (req,res)=>{
    console.log(req.body);
    let result = await db_product_info.getProductInfo(req.body);
    // console.log(result);
    if(result.msg.length){
        res.send(result);
    }else{
        res.send({err:1,msg:false});
    }
})

app.post('/updateProInfo',async (req,res)=>{
    // console.log(req.body);
    let result = await db_product_info.updateProInfo(req.body);
    // console.log(result);
    res.send(result);
})
app.post('/delProInfo',async (req,res)=>{
    let {_id,_path} = req.body;
    let result = await db_product_info.delProInfo(_id)
    if(result.msg){ //upload\PRt9tAz6qmAGiKG0dJ5jrO3m.jpg
        console.log(_path);
        fs.unlink(_path,err=>{
            if(err){
                console.log('删除失败');
            }else{
                console.log('删除成功');
            }
        })
    }
    res.send(result);
})



app.post('/returnLogin',(req,res)=>{
    req.session.destroy(err=>{
        if(err){
            res.send('false');
        }else{
            res.send('true');
        }
    });
});
app.post('/searchInfo',async (req,res)=>{
    let result = await db_product_info.searchInfo(req.body);
    res.send(result);
})

app.listen(8890,()=>{
    console.log('start');
});
