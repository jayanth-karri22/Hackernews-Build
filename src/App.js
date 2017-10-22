import React, { Component } from "react";
import "./App.css";
import Search from "./Search";
import Table from "./Table";

const DEFAULT_QUERY = "redux";
const DEFAULT_PAGE = 0;
const DEFAULT_HPP = 100;

const PATH_BASE = "https://hn.algolia.com/api/v1";
const PATH_SEARCH = "/search";
const PARAM_SEARCH = "query=";
const PARAM_PAGE = "page=";
const PARAM_HPP = "hitsPerPage=";

const URL = `${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${DEFAULT_QUERY}`;

const isSearched = searchTerm => item =>
  !searchTerm || item.title.toLowerCase().includes(searchTerm.toLowerCase());

const Loading = ()=>
<div>Loading...</div>

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      lists: "",
      searchKey:'',
      searchTerm: DEFAULT_QUERY,
      isLoading:false,
    };

    this.setSearchTopstories = this.setSearchTopstories.bind(this);
    this.fetchSearchTopstories = this.fetchSearchTopstories.bind(this);
    this.onDismiss = this.onDismiss.bind(this);
    this.onSearchChange = this.onSearchChange.bind(this);
    this.onSubmitSearch = this.onSubmitSearch.bind(this);
    this.needsToSearchTopstories = this.needsToSearchTopstories.bind(this);
  }

  setSearchTopstories(list) {
    const { hits, page } = list;
    const {searchKey,lists} = this.state;

    const oldHits = lists && lists[searchKey] ? lists[searchKey].hits : [];

    const updatedHits = [...oldHits, ...hits];

    this.setState({
      lists: { 
        ...lists,
        [searchKey]: {hits: updatedHits, page }
      },
      isLoading:false
    });
  }

  needsToSearchTopstories(searchTerm){
    return !this.state.lists[searchTerm];
  }


  onSubmitSearch(event) {
    const { searchTerm, list } = this.state;
    const page = (list && list.page) || 0;
    this.setState({searchKey:searchTerm});

    if(this.needsToSearchTopstories(searchTerm)){
      this.fetchSearchTopstories(searchTerm,DEFAULT_PAGE);
    }

    this.fetchSearchTopstories(searchTerm, DEFAULT_PAGE);
    event.preventDefault();
  }

  fetchSearchTopstories(searchTerm, page) {
    this.setState({isLoading:true});

    fetch(
      `${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}&${PARAM_PAGE}${page}&${PARAM_HPP}${DEFAULT_HPP}`
    )
      .then(response => response.json())
      .then(result => this.setSearchTopstories(result))
      .catch(e => e);
  }

  componentDidMount() {
    const { searchTerm } = this.state;
    this.setState({searchKey:searchTerm});
    this.fetchSearchTopstories(searchTerm, DEFAULT_PAGE);
  }

  onDismiss(id) {
    const {searchKey , lists} = this.state;
    const {hits,page} = lists[searchKey];

    const updatedList = hits.filter(
      item => item.objectID !== id
    );

    this.setState({
      lists: {
        ...lists,
        [searchKey] : {hits:updatedList,page}
      }
  })
  }

  onSearchChange(event) {
    this.setState({
      searchTerm: event.target.value
    });
  }

  render() {
    const { searchTerm, lists, searchKey } = this.state;
    const page = (lists && lists[searchKey] && lists[searchKey].page) || 0;

    const hits = (lists && lists[searchKey] && lists[searchKey].hits) || []
    return (
      <div className="page">
        <div className="interactions">
          <Search
            searchTerm={searchTerm}
            onSearchChange={this.onSearchChange}
            onSubmit={this.onSubmitSearch}
          >
            Search
          </Search>
        </div>
        {lists && <Table list={hits} onDismiss={this.onDismiss} />}
        <div className="interactions">
          {
            this.state.isLoading
            ?<Loading />
            :
          <button
            onClick={() => this.fetchSearchTopstories(searchKey, page + 1)}
          >
            More
          </button>
          }
        </div>
      </div>
    );
  }
}
export default App;
