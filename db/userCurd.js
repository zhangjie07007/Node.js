const router = require('express').Router(); 
// const session = require('express-session');
let dbModel = require('./userModel'); 

// dbModel.insertMany({ 
//     username:'username', 
//     password:'pwd', 
//     age:'99'
// }).then(()=>{
//     return {err:0,msg:'ins ok'}; 
// }).catch(err=>{
//     return {err:1,msg:'ins no ok'}; 
// })


let insertdb = body =>{
    let {username,pwd,age,nickname,img} = body;
    return dbModel.find({username:body.username})
    .then(data=>{
        // let {username,pwd,age} = body;
        // console.log(username,pwd,age);
        if(data.length !== 0){
            return {err:8890,msg:'用户名已存在'};
        }else{
             return dbModel.insertMany({ 
                username:username, 
                password:pwd, 
                age:age,
                nickname:nickname,
                img:img
            }).then(()=>{
                return {err:0,msg:'ins ok'}; 
            }).catch(err=>{
                return {err:1,msg:'ins no ok'}; 
            })
        }
    }).catch(err=>{
        console.log('错误');
    });
}

let finddb =()=>{
    return dbModel.find()
    .then(data=>{
        return {err:0,msg:data};
    }).catch(err=>{
        return {err:2,msg:'find no ok'};
    })
}

let finddbSortByAge =()=>{
    // let {targetname} = req.body;
    // console.log(targetname);
    return dbModel.find().sort({age:1})
    .then(data=>{
        return {err:0,msg:data};
    }).catch(err=>{
        return {err:2,msg:'find no ok'};
    })
}

let findmh =mh=>{  //姓名模糊查询
    let reg = new RegExp(mh);
    return dbModel.find({username:reg})
    .then(data=>{
        return {err:0,msg:data};
    }).catch(err=>{
        return {err:2,msg:'find no ok'};
    })
}

let getUserInfo =username=>{
    return dbModel.find({username:username})
    .then(data=>{
        return {err:0,msg:data};
    }).catch(err=>{
        return {err:2,msg:'find no ok'};
    })
}

let findname =obj=>{
    return dbModel.find(obj)
    .then(data=>{
        return {err:0,msg:data};
    }).catch(err=>{
        return {err:2,msg:'find no ok'};
    })
}

let loginRegister =body=>{
    let {username,pwd} = body;
    return dbModel.find({username:username,password:pwd})
    .then(data=>{
        console.log(data.length)
        return {err:0,msg:data.length};
    }).catch(err=>{
        return {err:2,msg:'false'};
    })
}


let getInfoByPage =body=>{ //分页查询
    let {pagesize=5,page=1} = body;
    console.log(body)
    return dbModel.find().limit(Number(pagesize)).skip(Number((page-1)*pagesize))
    .then(data=>{
        return{err:0,msg:data};
    }).catch(err=>{
        return{err:2,msg:'find no ok'};
    })
}

router.post('/findgt',(req,res)=>{
    let {gt} = req.body;
    // dbModel.find().gt('age',gt)
    dbModel.find({age:{$gt:gt}})
    .then(data=>{
        res.send({err:0,msg:data})
    }).catch(err=>{
        res.send({err:2,msg:'find no ok'});
    })
})

router.post('/findlt',(req,res)=>{
    let {lt} = req.body;
    // dbModel.find().lt('age',lt)
    dbModel.find({age:{$lt:lt}})
    .then(data=>{
        res.send({err:0,msg:data})
    }).catch(err=>{
        res.send({err:2,msg:'find no ok'});
    })
})

let deldb =body=>{
    let {username} = body;
    return dbModel.remove({username:username})
    .then(()=>{
        return {err:0,msg:'remove ok'};
    }).catch(err=>{
        return {err:3,msg:'remove no ok'};
    })
}

let updateInfo =(targetname,body)=>{
    let {nickname,age,newpwd} = body;

    return dbModel.updateOne({username:targetname},{$set:{nickname:nickname,age:age,password:newpwd}})
    .then(()=>{
        return {err:0,msg:true};
    }).catch(err=>{
        return {err:4,msg:false};
    })
}
let updateImg =(img,username)=>{
    return dbModel.updateOne({username:username},{$set:{img:img}})
    .then(()=>{
        return {err:0,msg:true};
    }).catch(err=>{
        return {err:0,msg:false};
    })
}

module.exports = {
    router,updateInfo,findname,updateImg,deldb,getInfoByPage,loginRegister,getUserInfo,findmh,finddbSortByAge,finddb,insertdb
};