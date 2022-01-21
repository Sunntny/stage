import '../Login/Login.css'
import { ApiPost } from '../Tool/Tool'
import { Link, useNavigate } from "react-router-dom";
import React, { useRef } from 'react'
import { message, Button, Space } from 'antd';

export default function Login() {
	const mobileinputref = useRef();
	const passinputref = useRef();
	const navigate = useNavigate();


	let log = () => {
		ApiPost('/cus/login', `account=${mobileinputref.current.value}&password=${passinputref.current.value}`, resp => {
			console.log(resp.data);
			if (resp.data.code == 2) {
				let page = localStorage.getItem('pathname');
				if (page) {
					localStorage.setItem('X-Token', resp.data.data.token)
					// localStorage.setItem('Token', resp.data.data.token)
					navigate(page)
					localStorage.removeItem('pathname')
				} else {
					localStorage.setItem('X-Token', resp.data.data.token)
					localStorage.setItem('Token', resp.data.data.token)
					message.success(resp.data.message);
					navigate('/')
				}

			} else {
				message.error(resp.data.message)
			}
		})
	}
	return (
		<div data-vide-bg="video/Ipad">
			<div class="center-container">
				<div class="header-w3l">
					<h1>Classic Login Form</h1>
				</div>

				<div class="main-content-agile">
					<div class="sub-main-w3">
						<div class="wthree-pro">
							<h2>登录</h2>
						</div>
						<form action="#" method="post">
							<input placeholder="账号" name="Name" class="user" type="email" required="" ref={mobileinputref} />
							<span class="icon1"><i class="fa fa-user" aria-hidden="true"></i></span><br /><br />
							<input placeholder="密码" name="Password" class="pass" type="password" required="" ref={passinputref} />
							<span class="icon2"><i class="fa fa-unlock" aria-hidden="true"></i></span><br />
							<div class="sub-w3l">
								<a href="#">忘记密码</a>
								<span className='regist'><Link to="/enroll">立即注册</Link></span>
								<div class="right-w3l">
									{/* <input type="submit" value="Login"/> */}
									<span className='sub-main-w3login' onClick={log}>Login</span>
								</div>
							</div>
						</form>
					</div>
				</div>
			</div>
		</div>
	)
}
