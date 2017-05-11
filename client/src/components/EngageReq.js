import React from 'react';
import axios from "axios";
import { Link } from 'react-router';
import _ from "lodash"
// import Peer from 'peerjs';
// import io from 'socket.io-client';
import EngageReqList from "./EngageReqList";
import Chat from "./Chat";
import VideoChat from './VideoChat.js';

class EngageReq extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      currentEngagement: [],
      messages: [],
      id : null,
      videoModal: false
    }
      this.fetchMessages = this.fetchMessages.bind(this);
      this.fetchCurrentEngagement = this.fetchCurrentEngagement.bind(this);
      this.fetchEngagements = this.fetchEngagements.bind(this);
      this.fetchCurrentId = this.fetchCurrentId.bind(this);
      this.fetchChatMessages = this.fetchChatMessages.bind(this);
      this.closeVideo = this.closeVideo.bind(this);
      this.openVideo = this.openVideo.bind(this);
  }

  componentDidMount () {
    this.fetchCurrentEngagement();
    // this.sendPeerId();
  }

  fetchCurrentEngagement() {
    const config = {
      headers: {'Authorization': 'Bearer ' + localStorage.id_token}
    };
    axios.get(API_ENDPOINT + "/api/engagements", config)
    .then(res => {
      _.each(res.data, data =>{
        this.setState({currentEngagement: [...this.state.currentEngagement, data]})
      })
    })
    .catch(err =>{
        console.log("Error fetchCurrentEngagement", err);
    })
  }

  fetchCurrentId(selectedEngageId) {
    this.setState({id: selectedEngageId})
  }

  fetchMessages(msgs) {
    this.setState({messages: msgs})
  }

  fetchEngagements(eng) {
    let completed;
    _.each(this.state.currentEngagement, (engagements, index) => {
      _.each(engagements, (value, key) => {
        value === eng.id ? completed = index : null
      })
    })
    this.state.currentEngagement.splice(completed, 1);
    this.setState({currentEngagement: this.state.currentEngagement});
  }

  fetchChatMessages(chatMsg) {
    this.setState({messages:[chatMsg, ...this.state.messages]})
  }

  closeVideo() {
    this.setState({ videoModal: false });
  }

  openVideo() {
    this.setState({ videoModal: true });
  }

  // sendPeerId() {
  //   // const socket = io.connect();
  //   const peer = new Peer({key: 'ghwfzjto973krzfr'});

  //   console.log('eng id', this.state.id);

  //   let peerId;
  //   peer.on('open', id => {
  //     peerId = id;
  //     // sockert.emit({join: })
  //     console.log('your peer id is', peerId);
  //   });
  //   // socket.to('P2Pvideo').emit('sendId', peerId);
  // }

  render() {
    return(
      <div >
        <h2
          className="title"
          style={{fontFamily: 'Ubuntu', fontWeight: "normal"}}
        >Current Engagements </h2>
        <EngageReqList
          openVideo={this.openVideo}
          msgs={this.state.messages}
          currentEngagement={this.state.currentEngagement}
          fetchEngagements={this.fetchEngagements}
          fetchId={this.fetchCurrentId}
          fetchMessages={this.fetchMessages}
        />
        <Chat
          id={this.state.id}
          fetchChatMessages={this.fetchChatMessages}
          messages={this.state.messages}
          currentEngagement={this.state.currentEngagement}
        />
        {this.state.videoModal ?
          <VideoChat closeVideo={this.closeVideo}/>
        : null}
      </div>
    )
  }
}

export default EngageReq;

