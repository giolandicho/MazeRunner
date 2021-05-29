import React from "react";
import "./Cell.css";

const Cell = ({row, col, start, end, wall, visited, isClicked,onMouseUp, onEnter, onLeave})=>{
    
    const extraClassName = 
    start ? "start-cell" : 
    end ? "end-cell" :
    wall ? "wall-cell" :
    visited ? "visited-cell" : ""
    
    

    
    return(
        <div 
            className={`cell ${extraClassName}`}
            id = {`cell-${row}-${col}`}
            onMouseDown = {()=> isClicked(row,col)}
            onMouseUp = {()=> onMouseUp(row,col)}
            onMouseEnter = {()=> onEnter(row,col)}
            onMouseLeave = {()=> onLeave(row,col)}
            >
        </div>  
    )
}

export default Cell;