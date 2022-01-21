import React, { useState, useEffect, createElement, useRef } from 'react'
import '../Detail/Detail.css'
import { ApiGet, ApiPost } from '../Tool/Tool'
import { useParams, useNavigate } from 'react-router-dom';
import { ipList as presentIp } from '../Tool/Ip'
import changeTime from '../Tool/changeTime';
//ant
import { Comment, Tooltip, Avatar, message, Modal } from 'antd';
import moment from 'moment';
import { LikeOutlined, LikeFilled, ExclamationCircleOutlined } from '@ant-design/icons';
import TextArea from 'antd/lib/input/TextArea';

// import App from '../App/App'

export default function Detail() {
    const [data, setData] = useState({});
    const [notes, setnotes] = useState([]);
    const [d, setD] = useState([]);
    const params = useParams();
    const navigate = useNavigate();
    const inputref = useRef();

    const [likes, setLikes] = useState(0);
    const [action, setAction] = useState(null);
    useEffect(() => {
        ApiGet(`/newsfront/detail?newsId=${params.id}`, resp => {
            console.log(resp.data.data);
            setData(resp.data.data)
            setnotes(resp.data.data.notes)
        })
    }, [])

    const like = (e) => {
        let token = localStorage.getItem('Token')
        if (token == null) {
            message.error('请登录')
            navigate('/login')
        } else {
            e.target.innerHTML++
            ApiGet(`/comment/favor?id=${e.target.id}&type=1`, resp => {
                console.log(resp);
            })
        }

    };
    /* 发表 */
    let publish = () => {
        let token = localStorage.getItem('X-Token')
        // let token = localStorage.getItem('Token')
        if (token == null) {
            function destroyAll() {
                Modal.destroyAll();
            }
            const { confirm } = Modal;
            setTimeout(() => {
                confirm({
                    icon: <ExclamationCircleOutlined />,
                    content: '是否要去登录？',
                    cancelText: '取消',
                    okText: '确认',
                    onOk() {
                        localStorage.setItem('pathname', window.location.pathname)
                        navigate('/login')
                    },
                    onCancel() {

                    },
                });
            }, 0);
        } else {
            ApiPost('/comment/add', `newsId=${params.id}&text=${inputref.current.value}`, resp => {
                if (resp.data.code == 2) {
                    message.success('发表成功')
                    window.location.reload()
                } else if (resp.data.code == 4) {
                    message.error(resp.data.message)
                    navigate('/login')
                } else {
                    message.error(resp.data.message)
                }
            })

        }
    }

    /* 回复 */
    let reply = (e) => {
          console.log(e.target.parentNode.nextElementSibling.children[0].children[0]);
        let text = e.target.parentNode.nextElementSibling.children[0]
        if (text.style.display == 'none') {
            text.style.display = 'block';
        } else {
            text.style.display = 'none'
        }
    }
    /* 发表回复 */
    let answer = (e) => {
        ApiPost('/comment/reply', `noteId=${e.target.id}&text=${e.target.previousElementSibling.value}`, resp => {
            console.log(resp.data);
            if (resp.data.code == 2) {
                message.success(resp.data.message);
                window.location.reload();
            } else {
                message.error('请先登录');
                navigate('/login')
            }
        })
    }
    //跳转
    let turn = () => {
        navigate('/')

    }

    return (
        <div className='all'>

            <h1 onClick={turn}>{data.title}</h1>
            <div className='picture'>
                <p dangerouslySetInnerHTML={{ __html: data.content }} ></p>
                <img alt='' src={`${data.pic}`}></img>
            </div>
            <div className='commend'>
                {/* <App></App> */}
                <h2>发表评论</h2>
                {/* <img src='/images/people.png' className='img'></img> */}
                {/* <input type='textarea' className='input' placeholder='发表神妙评论' ></input> */}
                <textarea className='input' placeholder='发表神妙评论' ref={inputref}></textarea>

                {/* <a href="#">Delete</a> */}
                <span onClick={publish}>发表</span>

            </div>
            <div className='list'>
                <h1>评论列表</h1>
                {
                    notes.map((item, index) => (
                        <Comment
                            actions={
                                [
                                    <Tooltip key="comment-basic-like" title="Like">
                                        <span>
                                            {createElement(action === 'liked' ? LikeFilled : LikeOutlined)}
                                            <span className="comment-action" onClick={like} id={item.id}>{item.favor}</span>
                                        </span>
                                    </Tooltip>,
                                    <span key="comment-basic-reply-to" onClick={reply}>回复</span>,
                                    <div style={{ display: "none" }} className='reply'>
                                        <TextArea className='area'></TextArea>
                                        <button onClick={answer} id={item.id}>发表回复</button>
                                    </div>

                                ]
                            }
                            author={<a>{item.author}</a>}
                            avatar={<Avatar src={presentIp.ip + `${item.avatar.portrait}`} />}
                            content={
                                <p>{item.text}</p>
                            }
                            datetime={changeTime(item.date)}
                        >
                            {
                                item.replys.map((item, index) => (
                                    <Comment key={index}
                                        actions={[
                                            <span><LikeOutlined /><span className="comment-action" id={item.id} onClick={like}>{item.favor}</span></span>,
                                            <span key="comment-basic-reply-to" onClick={reply} >回复</span>,
                                        ]}
                                        author={<a>{item.avatar.account}</ a>}
                                        avatar={<Avatar src={presentIp.ip + `${item.avatar.portrait}`} id="ava" />}
                                        content={
                                            <p>
                                                {item.text}
                                            </p >
                                        }
                                        datetime={changeTime(item.date)}
                                    />
                                ))
                            }
                        </Comment>
                    ))
                }

            </div>
        </div>
    )
}
