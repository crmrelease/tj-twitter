const express = require('express')
const router = express.Router()
const {isLoggedIn, isNotLoggedIn} = require('./middleware')
const {User}= require('../models')

router.get('/profile',isLoggedIn,(req,res)=>{
    res.render('profile',{title:'내 정보', user: req.user});
});

router.get('/join',isNotLoggedIn,(req,res)=>{
    res.render('join',{
        title: '회원가입',
        user:req.user,
        joinError:req.flash('joinError')
    })    
});

router.get('/',(req,res,next)=>{
    res.render('main',{
        title:'Tae-Witter',
        twits:[],
        user:req.user,       
        loginError:req.flash('loginError')
    })
});




module.exports = router;