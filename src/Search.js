import React from "react";

class Search extends React.Component{
  
  componentDidMount(){
    this.input.focus();
  }

  render(){
    const{
      searchTerm,
      onSearchChange,
      onSubmit,
      children
    } = this.props;
  return (
    <form onSubmit={onSubmit}>
      <input
        value={searchTerm}
        type="text"
        onChange={onSearchChange}
        ref={(node)=>{this.input=node; }}
      />
      <button type="submit">
        {children}
      </button>
    </form>
  );
};
}
export default Search;
