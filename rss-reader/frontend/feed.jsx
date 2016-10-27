import React, { Component } from 'react';
import { render } from 'react-dom';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import TextField from 'material-ui/TextField';
import FeedEntry from './feed_entry';
import localforage from 'localforage';

const styles = {
  actionStyle: {
    marginRight: 20,
    marginTop  : 20
  },
  textStyle: {
    width: '60%'
  },
  container: {
    marginTop: 20,
    textAlign: 'center'
  }
}

class Feed extends Component {
  constructor(props) {
    super(props);
    this.clickAddRSS       = this.clickAddRSS.bind(this);
    this.updateText        = this.updateText.bind(this);
    this.fetchSuccess      = this.fetchSuccess.bind(this);
    this.fetchFailure      = this.fetchFailure.bind(this);
    this.createFeedEntries = this.createFeedEntries.bind(this);
    this.addToLocalForage  = this.addToLocalForage.bind(this);
    this.checkLocalForage  = this.checkLocalForage.bind(this);

    this.state = {
      inputUrl: '',
      feed: [],
      sources: []
    }
  }
  clickAddRSS() {
    const newSourceList = this.state.sources.concat(this.state.inputUrl);
    this.setState({ sources: newSourceList });

    $.ajax({
      // found this little trick on stackoverflow to avoid access-control-allow-origin error
      // http://stackoverflow.com/questions/11346990/reading-rss-feed-with-jquery
      url: document.location.protocol
            + '//ajax.googleapis.com/ajax/services/feed/load?v=1.0&num=1000&callback=?&q='
            + encodeURIComponent(this.state.inputUrl),
      type: 'GET',
      dataType: 'json',
      success: this.fetchSuccess,
      error: this.fetchFailure
    });
  }
  componentDidMount() {
    this.checkLocalForage();
  }
  fetchSuccess(r) {
    // on first fetch grab the first 10 most recent items
    // on additional fetches grab the first 10 most recent items from that
    // next feed. do some form of merge sort

    // incoming feeds need to be sorted because they are dumb...
    const oldFeed = this.state.feed.slice()
    const newFeed = r.responseData.feed.entries.slice(0, 10)
    let mergedFeed = []
    let i = 0

    // refactor later
    while (i < 10 && newFeed.length > 0 && oldFeed.length > 0) {
      new Date(newFeed[0].publishedDate) > new Date(oldFeed[0].publishedDate) ?
        mergedFeed.push(newFeed.shift()) : mergedFeed.push(oldFeed.shift());
      i++;
    }

    mergedFeed = mergedFeed.concat(newFeed).concat(oldFeed).slice(0, 10);
    this.addToLocalForage(mergedFeed);
    this.setState({ feed: mergedFeed });
  }
  addToLocalForage(feed) {
    feed.forEach(function(entry, i) {
      localforage.setItem(String(i), entry).then(function (value) {
          // Do other things once the value has been saved.
          console.log(value);
      }).catch(function(err) {
          // This code runs if there were any errors
          console.log(err);
      });
    })
  }
  checkLocalForage() {
    const feed = []
    const self = this;
    localforage.iterate(function(value, key, iterationNumber) {
      feed.push(value)
      if (key === '9') {
        return feed;
      }
    }).then(function(result) {
      debugger
      self.setState({ feed: result.slice(0, 10)})
    });
  }
  fetchFailure(r) {
    console.log(r)
  }
  updateText(property) {
    return (e) => this.setState({[property]: e.target.value});
  }
  createFeedEntries() {
    if (this.state.feed.length === 0) { return; }

    return this.state.feed.map(function(entry, i) {
      return <FeedEntry
                key={i}
                title={entry.title}
                author={entry.author}
                publishedDate={entry.publishedDate}
                link={entry.link}
                />;
    });
  }
  render() {
    debugger
    return (
      <div style={styles.container}>
        <TextField
          hintText="Enter RSS Feed Link"
          style={styles.textStyle}
          onChange={this.updateText('inputUrl')}
          value={this.state.inputUrl}
        />
        <FloatingActionButton
          onClick={this.clickAddRSS}
          mini={true}
          style={styles.actionStyle}>
          <ContentAdd />
        </FloatingActionButton>
        {this.createFeedEntries()}
      </div>
    )
  }
}

export default Feed
