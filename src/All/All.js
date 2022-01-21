import React, { useState, useEffect } from 'react'
import { ApiGet } from '../Tool/Tool'
import { Link, Outlet, useNavigate } from "react-router-dom";
import '../All/All.css'

import { AxiosContext } from 'react-axios/lib/components/AxiosProvider'
/* ant */
import { Menu, message, Pagination } from 'antd';
import { MailOutlined, AppstoreOutlined, SettingOutlined } from '@ant-design/icons';

export default function All() {
    // const navigate = useNavigate();
    let [data, setData] = useState([])
    let [datas, setDatas] = useState([])
    let [filt, setFilt] = useState([])
    const navigate = useNavigate();

    useEffect(() => {
        ApiGet(`/newsfront/columns`, re => {
            console.log(re.data);
            setDatas(re.data.data);
            filt = re.data.data;
            for (let i = 0; i < filt.length; i++) {

                ApiGet(`/newsfront/list?page=1&columnName=${filt[i].columnName}`, resp => {
                    data = resp.data.data.list;
                    filt[i].list = data;
                    filt = JSON.parse(JSON.stringify(filt))
                    setData(resp.data.data.list)
                    setFilt(filt)
                })
            }
        })
    }, [])
    let exit = (e) => {
        console.log(e.target);
        ApiGet(`/cus/logout`, resp => {
            console.log(resp.data);
            if (resp.data.code == 2) {
                message.success(resp.data.message);
                localStorage.removeItem('X-Token');
                navigate('/login')
            }
        })
    }

    return (
        <div className='home'>
            <div className='top'>
                <img src='/images/baidu.png'></img>
                <input></input>
                <span>百度一下</span>
                <span>帮助</span>
                <span onClick={exit}>安全退出</span>

            </div>
            <div id='menu'>
                <Menu mode="horizontal" className='nav' className='nav'>
                    <Menu.Item >首页</Menu.Item>
                    {
                        datas.map((item, index) => (
                            <Menu.Item key={index}><Link to={`home${item.columnName}`}>{item.columnName}</Link></Menu.Item>
                        ))
                    }
                </Menu>
            </div>
            <div className='detail'>
                {filt.map((item, index) => (
                    <div key={index}>
                        <h1>{item.columnName}<Link to={`/home${item.columnName}`}>更多</Link></h1>
                        {
                            item.list && item.list.map(value => (
                                <div className='content'>
                                    <img src={value.pic} alt='' ></img>
                                    <p>
                                        <span><Link to={`/detail${value.newsId}`}>{value.title}</Link></span>
                                        <span>{value.author}</span>
                                        <span>{value.date}</span>
                                    </p>
                                </div>
                            ))
                        }

                    </div>
                ))}
                <Outlet></Outlet>
            </div>
            <div className='footer'>

                <div>
                    <h2>更多精彩内容</h2>
                    <p>Android版下载</p>
                    <p>iPhone版下载</p>
                    <p>扫描二维码, 收看更多新闻</p>
                </div>
                <div>
                    <h2>百度新闻独家出品</h2>
                    <p>1. 新闻由机器选取每5分钟自动更新</p>
                    <p>2. 百度新闻搜索源于互联网新闻网站和频道，系统自动分类排序</p>
                    <p>3. 百度不刊登或转载任何完整的新闻内容</p>
                </div>

            </div>



        </div>
    )
}
