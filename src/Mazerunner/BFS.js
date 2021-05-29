export const breadthFirstSearch = (grid, startCell, endCell)=>{
    startCell.distance = 0
    const cache = allCells(grid)
    const visitedCellsInOrder = []
    while(cache.length){
        closestCells(cache)
        const closestNeighbor = cache.shift()
        if(closestNeighbor.wall) continue
        if(closestNeighbor.distance === Infinity) return visitedCellsInOrder
        closestNeighbor.visited = true
        if(closestNeighbor === endCell) return visitedCellsInOrder
        visitedCellsInOrder.push(closestNeighbor)
        updateUnvisitedCells(closestNeighbor, grid)
    }
}

const allCells = (grid)=>{
    const cells = []
    for(const row of grid){
        for(const cell of row){
            cells.push(cell)
        }
    }
    return cells
}
const closestCells = (cache)=>{
    return cache.sort((a,b)=>{
        return a.distance - b.distance
    })
}
const updateUnvisitedCells = (cell, grid)=>{
    const unvisitedNeighbors = getNeighbors(cell,grid);

    for(const unvisitedCell in unvisitedNeighbors){
        unvisitedCell.distance = cell.distance + 1
        unvisitedCell.previous = cell
    }
}
const getNeighbors = (cell, grid)=>{
    const neighbors = []
    const {row,col} = cell
    if(col < grid[0].length-1) neighbors.push(grid[row][col+1])
    if(row < grid.length-1) neighbors.push(grid[row+1][col])
    if(row > 0) neighbors.push(grid[row-1][col])
    if(col > 0) neighbors.push(grid[row][col-1])
    return neighbors.filter(neighbor=> !neighbor.visited)
}

export const shortestPath = (endCell)=>{
    const shortestPathCells = []
    let current = endCell
    while(current){
        shortestPathCells.unshift(current)
        current = current.previous
    }
    return shortestPathCells
}