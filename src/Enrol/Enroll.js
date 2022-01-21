import React, { useState, useRef } from 'react';
import { render } from 'react-dom';
import { ConfigProvider, DatePicker, message, Button, Space, Form, Upload } from 'antd';
import { UserOutlined, LockOutlined ,LoadingOutlined, PlusOutlined} from '@ant-design/icons';
// 由于 antd 组件的默认文案是英文，所以需要修改为中文
import zhCN from 'antd/lib/locale/zh_CN';
import moment from 'moment';
import 'moment/locale/zh-cn';
import 'antd/dist/antd.css';
import { Input } from 'antd';

import { Link, useNavigate } from "react-router-dom";
// import React, { useRef, useState } from 'react'
import { ApiPost } from '../Tool/Tool'
import '../Enrol/Enroll.css'
moment.locale('zh-cn');

export default function Enroll() {
	//头像
	function getBase64(img, callback) {
		const reader = new FileReader();
		reader.addEventListener('load', () => callback(reader.result));
		reader.readAsDataURL(img);
	}

	function beforeUpload(file) {
		url = file
		const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
		if (!isJpgOrPng) {
			message.error('You can only upload JPG/PNG file!');
		}
		const isLt2M = file.size / 1024 / 1024 < 2;
		if (!isLt2M) {
			message.error('Image must smaller than 2MB!');
		}
		return isJpgOrPng && isLt2M;
	}

	class Avatar extends React.Component {
		state = {
			loading: false,
		};

		handleChange = info => {
			if (info.file.status === 'uploading') {
				this.setState({ loading: true });
				return;
			}
			if (info.file.status === 'done') {
				// Get this url from response in real world.
				getBase64(info.file.originFileObj, imageUrl =>
					this.setState({
						imageUrl,
						loading: false,
					}),
				);
			}
		};

		render() {
			const { loading, imageUrl } = this.state;
			const uploadButton = (
				<div>
					{loading ? <LoadingOutlined /> : <PlusOutlined />}
					<div style={{ marginTop: 8 }}>Upload</div>
				</div>
			);
			return (
				<Upload
					name="avatar"
					listType="picture-card"
					className="avatar-uploader"
					showUploadList={false}
					action="http://192.168.0.254:8088/cus/registe"
					beforeUpload={beforeUpload}
					onChange={this.handleChange}
				>
					{imageUrl ? < img src={imageUrl} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
				</Upload>
			);
		}
	}





	const useinputref = useRef();
	const telinputref = useRef();
	const wordinputref = useRef();
	let [state, setState] = useState([])
	// let [file, setFile] = useState('')
	let url = ''
	// const tologin =()=>navigate('/login')
	const navigate = useNavigate();

	//账号

	let regist = () => {
		let tel = telinputref.current.value;
		let reg = /^1[3-9]\d{9}$/.test(tel);
		if (reg) {
			let form = new FormData();
			form.set('account', useinputref.current.value)
			form.set('tel', telinputref.current.value)
			form.set('password', wordinputref.current.value)
			form.set('file', url)
			ApiPost("/cus/registe", form, resp => {
				state = resp.data
				setState(state);
				console.log(state);
				if (state.code == 2) {
					message.success(resp.data.message);
					navigate('/login')
				} else {
					message.error(resp.data.message);
				}
			})
		} else {
			message.error('手机号码格式错误')
		}
	}
	
	return (
		<div className="signinform">

			<div className="container">

				<div className="w3l-form-info">
					<div className="w3l_form">
						<div className="left_grid_info">
							<img src="images/wm.svg" alt="" />
						</div>
					</div>
					<div className="w3_info">
						<h2>注册</h2>
						<Avatar />
						<Form initialValues={{ remember: true }} >
							<div className="input-group">
								<span><i className="fas fa-user" aria-hidden="true"></i></span>
								<input type="email" placeholder="账号" required="" ref={useinputref} />
							</div>
							<div className="input-group">
								<span><i className="fas fa-user" aria-hidden="true"></i></span>
								<input type="text" placeholder="手机号" required="" ref={telinputref} />
							</div>
							<div className="input-group">
								<span><i className="fas fa-key" aria-hidden="true"></i></span>
								<input type="Password" placeholder="密码" required="" ref={wordinputref} />
							</div>
							<div className="form-row bottom">
								<div className="form-check">
									<input type="checkbox" id="remenber" name="remenber" value="remenber" />
									<label for="remenber"> Remember me?</label>
								</div>
								{/* <a href="#url" className="forgot">Forgot password?</a> */}
							</div>
							{/* <Form.Item name="file" height="100">
								<Upload listType="picture" beforeUpload={onBeforeUpload}>
									<Button style={{ height: "40px" }} icon={<UploadOutlined />}>
										上传头像
									</Button>
								</Upload>
							</Form.Item> */}
							{/* <span className='btn-primary' onClick={regist}>注册成功</span>*/}
							<button className='btn-primary' onClick={regist}>注册成功</button>
						</Form>
						<p className="continue"><span>or Sign in with</span></p>
						<div className="social-login">
							<a href="#facebook">
								<div className="facebook">
									<span className="fab fa-facebook" aria-hidden="true"></span> 微信

								</div>
							</a>
							<a href="#google">
								<div className="google">
									<span className="fab fa-google-plus-g" aria-hidden="true"></span> QQ
								</div>
							</a>
						</div>
						<p className="account">已有账号? {/* <a href="#signup">登录</a> */}<span><Link to="/login">登录</Link></span></p>
					</div>
				</div>

			</div>
		</div>

	)
}
