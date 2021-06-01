import React, {useState, useEffect} from "react";
import Cell from "./Cell"
import {breadthFirstSearch, shortestPath} from "./BFS"
import "./Mazerunner.css";

const Mazerunner = ()=>{

    //use state to initialize grid
    const [grid, setGrid] = useState([])
    //use state to determine if cell is being clicked
    const [clicked, setClicked] = useState(false)
    //use state to determine if start cell is being clicked
    const [start, setStart] = useState(false)
    //use state to determine if end cell is being clicked
    const [end, setEnd] = useState(false)
    //use state while animation is visualizing
    const [visualizing, isVisualizing] = useState(false)
    //use state to reset grid
    const [reset, hasBeenReset] = useState(true)

    const start_row = 20
    const start_col = 10
    const end_row = 20
    const end_col = 50

    //builds initial cell
    const createCell = (row,col) => {
        return {
            row, col,
            start: row===start_row && col===start_col,
            end: row===end_row && col ===end_col,
            wall: false,
            visited: false,
            distance: Infinity,
            previous: null,
        }
    }

    //render initial grid
    const renderGrid = ()=>{
        let grid = []
        for(let row = 0; row < 40; row++){
            let currentRow = []
            for(let col = 0; col < 60; col++){
                let newCell = createCell(row,col)
                currentRow.push(newCell)
            }
            grid.push(currentRow)
        }
        return grid        
    }

    //handles cell click event
    const handleMouseDown = (row,col)=>{
        //redirects if cell clicked is the start cell
        if(grid[row][col].start){
            handleStartMouseDown(row,col)
            return
        }

        //redirects if cell clicked is the end cell
        if(grid[row][col].end){
            handleEndMouseDown(row,col)
            return
        }
        const newGrid = toggleWall(grid, row, col)
        setGrid(newGrid)
        setClicked(true)
    }

    //handles cell mouse enter event
    const handleMouseEnter = (row, col)=>{
        //returns if mouse is not clicked
        if(!clicked) return
        if(start){
            handleMouseEnterForStart(row, col)
            return
        }
        if(end){
            handleMouseEnterForEnd(row, col)
            return
        }
        else{
            const newGrid = toggleWall(grid, row, col)
            setGrid(newGrid)
        }
    }
    const handleStartMouseDown = (row,col)=>{
        setStart(true)
        setClicked(true)
        
    }
    const handleEndMouseDown = (row,col)=>{
        setEnd(true)
        setClicked(true)
        
    }
    const handleMouseEnterForStart = (row,col)=>{
        if(!start) return
        const newGrid = toggleStart(grid, row, col)
        setGrid(newGrid)
        
    }
    const handleMouseEnterForEnd = (row,col)=>{
        if(!end) return
        const newGrid = toggleEnd(grid, row, col)
        setGrid(newGrid)
        
    }
    const handleMouseLeave = (row,col)=>{
        if(!clicked) return
        let newGrid;
        if(start){
            newGrid = toggleStart(grid, row, col)
            setGrid(newGrid)
        }
        if(end){
            newGrid = toggleEnd(grid, row, col)
            setGrid(newGrid)
        }
    }
    const handleStop = (row,col) => {
        setClicked(false)
        setStart(false)
        setEnd(false)
    }
    const getStart = ()=>{
        let startCell = grid[start_row][start_col]
        grid.forEach(row =>{
           for(let i = 0; i < row.length; i++){ 
            let cell = row[i]
            if(cell.start){
                startCell = cell
            }
          }  
        })
        return startCell
    }
    const getEnd = ()=>{
        let endCell = grid[start_row][start_col]
        grid.forEach(row =>{
           for(let i = 0; i < row.length; i++){ 
            let cell = row[i]
            if(cell.end){
                endCell = cell
            }
          }
        })
        return endCell
    }
    const handleBFS = ()=>{
        const startCell = getStart(grid)
        const endCell = getEnd(grid)
        minorGridReset(grid)
        const visitedCells = breadthFirstSearch(grid, startCell, endCell)
        const path = shortestPath(endCell)
        renderBFS(visitedCells, path)
        isVisualizing(true)
        hasBeenReset(false)
    }
    const renderBFS = (visitedCells, path)=>{
        for(let i = 0; i <= visitedCells.length-1; i++){
            if(i === visitedCells.length-1){
                setTimeout(()=>{
                renderShortestPath(path)},3*i)
                return
            }
            setTimeout(()=>{
                const cell = visitedCells[i]
                if(!cell.start){
                    document.getElementById(`cell-${cell.row}-${cell.col}`).className = "cell visited-cell"
                }
            }, 3*i)
        }
    }
    const renderShortestPath = (path) =>{
        console.log("working")
        if(path[0] !== getStart()){
            alert("no path available")
            isVisualizing(false)
            hasBeenReset(false)
        }
        for(let i = 1; i < path.length-1; i++){
            setTimeout(()=>{
                const cell = path[i]
                document.getElementById(`cell-${cell.row}-${cell.col}`).className = "cell shortest-path-cell"
            }, 50*i)
        }
        isVisualizing(false)
        hasBeenReset(false)
        console.log("done rendering")
    }

    const toggleWall = (grid,row,col)=>{
        const newGrid = grid.slice()
        const cells = newGrid[row][col]
        const newCell = {
            ...cells,
            wall: !cells.wall,
        }
        newGrid[row][col] = newCell
        return newGrid
    }
    const toggleStart = (grid, row, col)=>{
        const newGrid = grid.slice()
        const cells = newGrid[row][col]
        const newCell = {
            ...cells,
            start: !cells.start,
        }
        newGrid[row][col] = newCell
        
        return newGrid
    }
    const toggleEnd = (grid, row, col)=>{
        const newGrid = grid.slice()
        const cells = newGrid[row][col]
        const newCell = {
            ...cells,
            end: !cells.end,
        }
        newGrid[row][col] = newCell
        
        return newGrid
    }
    const gridReset = ()=>{
        if(visualizing)return
        isVisualizing(false)
        const grid = renderGrid()
        setGrid(grid)
        grid.forEach((row)=>{
            for(let i = 0; i < row.length; i++){
                let cell = (row[i])
                if(!cell.start && !cell.end && !cell.wall){
                    document.getElementById(`cell-${cell.row}-${cell.col}`).className = "cell"
                }
            }
        })
        hasBeenReset(true)
        console.log("grid has been reset")     
    }
    const minorGridReset = (grid)=>{
        if(visualizing)return
        grid.forEach((row) =>{
            for(let i = 0; i < row.length; i++){
            let cell = (row[i])
                if(!cell.start && !cell.end && !cell.wall){
                    document.getElementById(`cell-${cell.row}-${cell.col}`).classname = "cell"
            }
          }
        })
    }

    useEffect(() =>{
        const grid = renderGrid()
        setGrid(grid)
    },[])
    
    return(
        <div className= "container">
            <div className= "grid">
                {grid && grid.map((row, rowIndex)=>{
                    return <div key = {rowIndex}>
                        {row.map((cell, cellIndex) => {
                            const {row, col, start, end, wall} = cell;
                        return (
                        <Cell
                            key = {cellIndex}
                            row = {row}
                            col = {col}
                            start = {start}
                            end = {end}
                            wall = {wall}
                            clicked = {clicked}
                            isClicked = {(row,col) => handleMouseDown(row,col)}
                            onMouseUp = {(row,col)=> handleStop(row,col)}
                            onEnter = {(row,col) => handleMouseEnter(row,col)}
                            onLeave = {(row,col) => handleMouseLeave(row,col)}
                            >
                        </Cell>);
                            })}
                    </div>
                })}
            </div>
            <div className="run-it" onClick = {()=> handleBFS(grid)}>
                <h1>Run it</h1>
            </div>
            <div className="reset" onClick = {()=> gridReset()}>
                <h1>Reset</h1>
            </div>
        </div>    
    )
}
export default Mazerunner; 
