import { ApiGet } from '../Tool/Tool'
import { Link, Outlet, useParams, useNavigate } from "react-router-dom";
import React, { useState, useEffect } from 'react'
import { AxiosContext } from 'react-axios/lib/components/AxiosProvider'
/* ant */
import { Menu, message, Button, Space, Pagination } from 'antd';
// import { MailOutlined, AppstoreOutlined, SettingOutlined } from '@ant-design/icons';
import '../Home/Home.css'

export default function All() {
    const [data, setData] = useState([])
    const [datas, setDatas] = useState([])
    const params = useParams();
    const navigate = useNavigate();

    const [turnpa, setTurnpa] = useState([])
    let [pages, setPages] = useState(0)
    let [currPage, setcurrPage] = useState(1)
    useEffect(() => {
        ApiGet(`/newsfront/list?columnName=${params.columnName}`, resp => {
            setData(resp.data.data.list)
            console.log(resp.data.data.list);
            console.log(params.id);
            setTurnpa(resp.data.data.list)
            setPages(resp.data.data.total);
            setcurrPage(resp.data.data.pageNum)

            ApiGet(`/newsfront/columns?columnName=${params.columnName}`, resp => {
                console.log(resp.data);
                setDatas(resp.data.data)
            })
        })
    }, [params.columnName])
    let exit = (e) => {
        // console.log(e.target);
        ApiGet(`/cus/logout`, resp => {
            console.log(resp.data);
            if (resp.data.code == 2) {
                message.success(resp.data.message);
                localStorage.removeItem('X-Token');
                navigate('/login')
            }
        })
    }
    let newarr = data.filter(item => (item.column.columnName == params.columnName))
    //翻页

    let turnpage = (page) => {
        ApiGet(`/newsfront/list?page=${page}&columnName=${params.columnName}`, resp => {
            console.log(resp);
            setData(resp.data.data.list)
            setTurnpa(resp.data.data.list);
            setPages(resp.data.data.total);
            setcurrPage(resp.data.data.pageNum)
        })
    }
    return (
        <div className='home'>
            <div className='search'>

                <img src='/images/baidu.png'></img>
                <input></input>
                <span>百度一下</span>
                <span>帮助</span>
                <span onClick={exit}>安全退出</span>
            </div>
            <div id='menu'>
                <Menu mode="horizontal" className='nav'>
                    <Menu.Item ><Link to='/'>首页</Link></Menu.Item>
                    {
                        datas.map((item, index) => (
                            <Menu.Item key={index}><Link to={`/home${item.columnName}`}>{item.columnName}</Link></Menu.Item>
                        ))
                    }
                </Menu>
            </div>
            <div className='detail'>
                <h1>{params.columnName}</h1>
                {newarr.map((item, index) => (
                    <div key={index} className='message'>
                        {/* <p><img src={item.pic} alt='' className='picture'></img></p> */}
                        <img src={item.pic} alt='' className='picture'></img>
                        <p className='info'>
                            <span><Link to={`/detail${item.newsId}`}>{item.title}</Link></span>
                            <span>{item.remark}</span>
                            <span>{item.author}|</span>
                            <span>{item.date}</span>
                        </p>
                    </div>
                ))}
            </div>
            <Pagination total={pages} onChange={turnpage} current={currPage}></Pagination>

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
