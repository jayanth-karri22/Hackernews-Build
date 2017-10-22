import React from 'react'

const Table = (props) => {
  return(
  <div className="table">  
    {props.list.map((item)=>
          <div key={item.objectID} className="table-row">
            <span style={{width:'40%'}}>
              <a href={item.url}>{item.title}</a>
            </span>
            <span style={{width:'30%'}}>{item.author}</span>
            <span style={{width:'10%'}}>{item.num_comments}</span>
            <span style={{width:'10%'}}>{item.points}</span>
            <span style={{width:'10%'}}>
              <button onClick={()=>props.onDismiss(item.objectID)} className="button-inline" type="button">Dismiss</button>
            </span>
          </div>
    )}
  </div>      
  )
}

export default Table;