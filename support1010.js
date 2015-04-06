/**
 * Created by altair21 on 15/4/1.
 */
documentWidth = window.screen.availWidth;
gridContainerWidth = 0.855 * documentWidth;
cellSideLength = 0.08 * documentWidth;
cellSpace = 0.005 * documentWidth;
dragContainerWidth = 0.94 * documentWidth;
dragCellSideLength = 0.05 * documentWidth;
dragCellSpace = 0.005 * documentWidth;

function getTop(i, j){
    return cellSpace + i * (cellSpace + cellSideLength);
}

function getLeft(i, j){
    return cellSpace + j * (cellSpace + cellSideLength);
}

function getDragBlockLeft(i){
    return (dragCellSideLength + dragCellSpace) * 6 * i;
}

function getDragTop(j, k){
    return dragCellSpace + j * (dragCellSpace + dragCellSideLength);
}

function getDragLeft(j, k){
    return dragCellSpace + k * (dragCellSpace + dragCellSideLength);
}

function getDragCellColor(index){
    switch (index){
        case 0: return "#7e8ed5";break;
        case 1: return "#ffc63e";break;
        case 2: return "#ed954a";break;
        case 3: return "#e76a82";break;
        case 4: return "#dc6555";break;
        case 5: return "#5cbee4";break;
        case 6: return "#59cb86";break;
        case 7: return "#98dc55";break;
        case 8: return "#4dd5b0";break;
        default : return "black";
    }
}
