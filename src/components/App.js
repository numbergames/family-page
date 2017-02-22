import React, { Component } from 'react';
import { connect } from 'react-redux';
import cookie from 'react-cookie';

import { fetchMessages } from '../actions/messages';
import { fetchMembers } from '../actions/members';
import { fetchCurrentUser } from '../actions/current-user';

import MessageNode from './MessageNode';
import Header from './Header';
import CommentsContainer from './CommentsContainer';
import Announcement from './Announcement';
import CommentInput from './CommentInput';
import UserPhotoIcons from './UserPhotoIcons';

export class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      loggedInUser: ''
    };
  }

  componentDidMount() {
    if (this.props.location.query.token) {
      cookie.save('accessToken', this.props.location.query.token);
    }
    this.props.dispatch(fetchMessages());
    this.props.dispatch(fetchMembers());
    this.props.dispatch(fetchCurrentUser());
  }

  render() {
    return (
      <div className="container">
        <Header />
        <UserPhotoIcons members={this.props.members} />
        <Announcement
          currentAvatar={this.props.currentAvatar}
          currentNickname={this.props.currentNickname}
        />

        {
          this.props.messages.map((message) => {
            const replyToName = message.userId in this.props.members
              ? this.props.members[message.userId].nickname
              : '...loading...';

            if ((message.comments.length === 0) && (message.userId === this.props.currentUser)) {
              return (
                <div>
                  <MessageNode
                    message={message}
                    currentUser={this.props.currentUser}
                    memberAvatar={
                    (message.userId in this.props.members)
                      ? this.props.members[message.userId].avatar
                      : null
                    }
                  />
                </div>
              );
            } else if (message.comments.length === 0) {
              return (
                <div key={message._id}>
                  <MessageNode
                    message={message}
                    currentUser={this.props.currentUser}
                    memberAvatar={
                      (message.userId in this.props.members)
                        ? this.props.members[message.userId].avatar
                        : null
                      }
                  />
                  <CommentInput
                    currentAvatar={this.props.currentAvatar}
                    messageId={message._id}
                    to={message.userId}
                    replyToName={replyToName}
                  />
                </div>
              );
            }
            return (
              <div key={message._id}>
                <MessageNode
                  message={message}
                  currentUser={this.props.currentUser}
                  memberAvatar={
                    (message.userId in this.props.members)
                      ? this.props.members[message.userId].avatar
                      : null
                    }
                />

                <CommentsContainer
                  message={message}
                  currentAvatar={this.props.currentAvatar}
                  currentUser={this.props.currentUser}
                  members={this.props.members}
                />
              </div>
            );
          })
          }
      </div>
    );
  }
  }

App.defaultProps = {
  messages: [{}],
  members: {},
  currentUser: null,
  currentAvatar: null,
  currentNickname: null,
};

App.propTypes = {
  dispatch: React.PropTypes.func.isRequired,
  messages: React.PropTypes.arrayOf(React.PropTypes.object),
  members: React.PropTypes.objectOf(React.PropTypes.object),
  currentUser: React.PropTypes.string,
  currentAvatar: React.PropTypes.string,
  currentNickname: React.PropTypes.string,
};

const mapStateToProps = state => ({
  currentUser: state.messages.currentUser,
  currentAvatar: state.messages.currentAvatar,
  currentNickname: state.messages.currentNickname,
  messages: state.messages.messages,
  members: state.members.members,
  zoomed: state.status.zoomed,
});

export default connect(mapStateToProps)(App);
