
/**
* content listing and details page
*
*/

/* Render content list view */
var ContentList = React.createClass({
	render: function() {
		var commentNodes = this.props.data.map(function(comment, index) {
			return (
				<ContentListView showname={comment.title} key={index} 
					assetpath={comment.images.portrait.url} id={comment.id}>
					{comment.images.portrait.url}
				</ContentListView>
				);
		});
		return (
			<div className="contentList"> {commentNodes} </div>
			);
	}
});

/*Render contents list  */

var ContentListView = React.createClass({
	render: function() {
		var rawMarkup = marked(this.props.children.toString(), {sanitize: true});
		return (
			<div className="content">
				<AssetPic assetpath={this.props.assetpath}  />
				<a className="itemname" href={"#itemdetails/"+this.props.id}  key={this.props.key}> {this.props.showname} </a>
			</div>
			);
	}
});


/* Render Item image with imageshack */
var AssetPic = React.createClass({
	render: function() {
		return (
			<img src={"https://ooyala.imageshack.com/200x145/"+this.props.assetpath} />
			);
	}
});

/* Fetch the content listing from the server and render the result */
var ContentListFetch = React.createClass({

	getInitialState: function() {
		return {data: []};
	},

	componentDidMount: function() {
		$.get(this.props.url, function(result) {
			var collection = typeof result.entries !== 'undefined' ? result.entries : result;
			if (this.isMounted()) {
				this.setState({data: collection});
			}
		}.bind(this));
	},

	render: function() {
		return (
			<div className="ContentBox">
			<h2>Content listing</h2>
			<ContentList data={this.state.data} />
			</div>
			);
	}
});

/* Fetch the content details from the server and render the result */
var ContentDetailsFetch = React.createClass({

	getInitialState: function() {
		return {data: []};
	},

	componentDidMount: function() {
		$.get(this.props.url, function(result) {
			var collection = typeof result.entries !== 'undefined' ? result.entries : result;
			if (this.isMounted()) {
				this.setState({data: collection});
			}
		}.bind(this));
	},

	render: function() {
		return (
			<div className="ContentBox">
			<ItemDetails data={this.state.data} />
			</div>
		); 
 }
});

/* Render Item details */
var ItemDetails = React.createClass({
	render: function() {
		var data = this.props.data;
		if(typeof data.images !== 'undefined'){
		return (
			<div className="content">
		 
		 
			<VideoOverLay url={data.media[0].url} poster={data.images.portrait.url} />
			<h2 className="itemname"> {data.title} </h2>
			<div className="otherdetails">
			<div className="description">{data.description}</div>
			</div>
			</div>
			);
		}
		else{
			return (
			<div className="content"></div>
			); 
		}
	}
});


var VideoOverLay = React.createClass({

render: function() {

	console.log(this.props);

	var videoOptions = {
		url: this.props.url,
		poster: this.props.poster
	}

		return (
			React.createElement(VideoPlayer, {options: videoOptions})
			);
		//React.render(React.createElement(VideoPlayer, {options: videoOptions}), videoStage);
	}
});

/* Router to get content details by item ID */
routie('itemdetails/:id', function(id) {
	React.render(
		<ContentDetailsFetch url={"/details/"+id} view="details" />, document.getElementById('content')
		);  
});

/* Router to show content Listing in home page */
routie('', function() {
	React.render(
		<ContentListFetch url="/list" view="list" />, document.getElementById('content')
		);  
});
