import React,{createElement}from 'react';
import { Comment, Avatar, Form, Button, List, Input,Tooltip } from 'antd';
import moment from 'moment';
import { DislikeOutlined, LikeOutlined, DislikeFilled, LikeFilled } from '@ant-design/icons';

const { TextArea } = Input;

const CommentList = ({ comments }) => (
    <List
        dataSource={comments}
        header={`${comments.length} ${comments.length > 1 ? 'replies' : 'reply'}`}
        itemLayout="horizontal"
        renderItem={props => <Comment {...props} />}
    />
);

const Editor = ({ onChange, onSubmit, submitting, value }) => (
    <>
        <Form.Item>
            <TextArea rows={4} onChange={onChange} value={value} />
        </Form.Item>
        <Form.Item>
            <Button htmlType="submit" loading={submitting} onClick={onSubmit} type="primary">
                Add Comment
            </Button>
        </Form.Item>
    </>
);

class App extends React.Component {
    state = {
        comments: [],
        submitting: false,
        value: '',
    };

    handleSubmit = () => {
        if (!this.state.value) {
            return;
        }

        this.setState({
            submitting: true,
            likes:0,
            dislikes:0,
            action:null
        });
        /* 点赞 */
        const like = () => {
            this.setState({
                likes:1
            })
        //   this.setState(this.state.likes,1)
        };

        const dislike = () => {
            this.setState(this.state.dislikes,1)
        };
        const actions = [
            <Tooltip key="comment-basic-like" title="Like">
                <span onClick={like}>
                    {createElement(this.state.action === 'liked' ? LikeFilled : LikeOutlined)}
                    <span className="comment-action">{this.state.likes}</span>
                </span>
            </Tooltip>,
            <Tooltip key="comment-basic-dislike" title="Dislike">
                <span onClick={dislike}>
                    {React.createElement(this.state.action === 'disliked' ? DislikeFilled : DislikeOutlined)}
                    <span className="comment-action">{this.state.dislikes}</span>
                </span>
            </Tooltip>,
            <span key="comment-basic-reply-to">Reply to</span>,
        ];

        setTimeout(() => {
            this.setState({
                submitting: false,
                value: '',
                comments: [
                    ...this.state.comments,
                    {
                        author: 'Han Solo',
                        avatar: 'https://joeschmoe.io/api/v1/random',
                        content: <p>{this.state.value}</p>,
                        datetime: moment().fromNow(),
                    },
                ],
            });
        }, 1000);
    };

    handleChange = e => {
        this.setState({
            value: e.target.value,
        });
    };

    render() {
        const { comments, submitting, value } = this.state;

        return (
            <>
                {comments.length > 0 && <CommentList comments={comments} />}
                <Comment
                    // actions={actions}
                    avatar={<Avatar src="https://joeschmoe.io/api/v1/random" alt="Han Solo" />}
                    content={
                        <Editor
                            onChange={this.handleChange}
                            onSubmit={this.handleSubmit}
                            submitting={submitting}
                            value={value}
                        />
                    }
                />
            </>
        );
    }
}
export default App