import React, { Component } from 'react';
import { render } from 'react-dom';
import Paper from 'material-ui/Paper';

const style = {
  height: 170,
  width: '80%',
  margin: 20,
  textAlign: 'center',
  display: 'inline-block'
};

class FeedEntry extends Component {
  constructor(props) {
    super(props)

    this.timeAgo      = this.timeAgo.bind(this);
    this.formatAuthor = this.formatAuthor.bind(this);
  }

  timeAgo() {
    const date = new Date(this.props.publishedDate);
    return date.toDateString() + ", " + date.toLocaleTimeString();
  }

  formatAuthor() {
    const skip = 'and';
    const words = this.props.author.split(' ');

    return words.map(function(word) {
      if (word !== skip) {
        return word.slice(0, 1).toUpperCase() + word.slice(1).toLowerCase(1);
      } else {
        return word;
      }
    }).join(" ")
  }

  render() {
    return (
      <Paper style={style} zDepth={3} rounded={true}>
        <a href={this.props.link}><h3>{this.props.title}</h3></a>
        <h4>{this.formatAuthor()}</h4>
        <h5>{this.timeAgo()}</h5>
      </Paper>
    )
  }
};

export default FeedEntry;
