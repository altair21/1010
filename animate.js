/**
 * Created by altair21 on 15/4/4.
 */
function showBlockClear(i, j){
    var blockCell = $('#block-cell-'+i+'-'+j);
    blockCell.animate({
        width:"0px",
        height:"0px",
        left:getLeft(i, j) + 0.5 * cellSideLength + "px",
        top:getTop(i, j) + 0.5 * cellSideLength + "px"
    },250);
}

function showDragBlock(id){
    var dragBlock = $('#drag-block-'+id);
    dragBlock.animate({
        left:getDragBlockLeft(id),
        top:"0px",
        width:5 * dragCellSideLength + 6 * dragCellSpace,
        height:5 * dragCellSideLength + 6 * dragCellSpace
    },300);
}