import React from 'react'
/* 路由页面 */
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
/* 注册 */
import Enroll from '../Enrol/Enroll'
/* 登录 */
import Login from '../Login/Login'
/* 首页 */
import Home from '../Home/Home'
/* 详情 */
import Detail from '../Detail/Detail'
import All from '../All/All'

export default function View() {
    return (
        <Router>{/* 加上这个浏览器可用 */}
            <Routes>
                <Route path='/' exact element={<All />}></Route>
                <Route path='/home:columnName' exact element={<Home />}></Route>
                <Route path='/detail:id' exact element={<Detail />}></Route>
                <Route path='/login' exact element={<Login />}></Route>
                <Route path='/enroll' exact element={<Enroll />}></Route>
            </Routes>
        </Router>
    )
}
