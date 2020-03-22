const express = require('express');
const {User} = require('../models');
const bcrypt = require('bcrypt')
const passport = require('passport')
const {isLoggedIn, isNotLoggedIn} = require('./middleware')

const router = express.Router();

router.post('/join',isNotLoggedIn,async (req,res,next)=>{
    const {email, nick, password} = req.body;
    try{
        const exUser = await User.findOne({where:{email}})
        if(exUser){
            req.flash('joinError','이미 가입했구만');
            return res.redirect('/join')
        }
            const hash = await bcrypt.hash(password,10);
            await User.create({
                email, 
                nick, 
                password:hash
            })           
            return res.redirect('/');

    } catch(error){
        console.error(error)
        next(error)
    }
}),

router.post('/login',isNotLoggedIn,(req,res,next)=>{
    passport.authenticate('local',(authError, user,info)=>{
        if(authError){
            console.error(authError);
            return next(authError);
        }
        if(!user){
            req.flash('loginError',info.message);
            return res.redirect('/');
        }
        return req.login(user,(loginError)=>{
            if(loginError){
                console.error(loginError);
                return next(loginError);
            }
            return res.redirect('/');
        })
    })(req,res,next);
})

router.get('/logout',isLoggedIn,(req,res,next)=>{
    req.logout();
    req.session.destroy();
    res.redirect('/');
})

router.get('/kakao',passport.authenticate('kakao'));
router.get('/kakao/callback',passport.authenticate('kakao',{
    failureRedirect:'/'
}),(req,res)=>{
    res.redirect('/')
});

module.exports = router