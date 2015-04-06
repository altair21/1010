/**
 * Created by altair21 on 15/4/1.
 */
var board = new Array(10);
var score = 0;
var blockColor = new Array(3);  //下面三个拖拽方块的颜色索引记录
var canClick = new Array(3);    //下面三个方块是否已填充入棋盘的记录
var alreadyFill = 0;            //当前已填充入棋盘的方块个数，为3时生成新的拖拽方块
var dragBoard = new Array(3);   //记录三个拖拽方块的数组
var fillPoint = {x:0,y:0};      //记录填充棋盘的坐标
var touchX = 0;                 //记录触摸点
var touchY = 0;
var touchDeltaX = 0;            //记录偏移量
var touchDeltaY = 0;
var touchId = 0;                //记录触摸div的id
var touching = false;
var dragFalse = [               //记录拖拽方块的位置，拖拽失败时调用
    {
        left:0,
        top:0,
        width:0,
        height:0
    },
    {
        left:0,
        top:0,
        width:0,
        height:0
    },
    {
        left:0,
        top:0,
        width:0,
        height:0
    }
];
var overlapPoint = [            //记录三个方块某一个有颜色的位置（在标记时存储，省去了查找位置的时间）
    {
        x:0,
        y:0
    },
    {
        x:0,
        y:0
    },
    {
        x:0,
        y:0
    }
];

var statusOfBlock = [1, 2, 2, 2, 2, 4, 4, 1, 1];   //0-一块、1-长两块、2-长三块、3-长四块、4-长五块、5-长L形、6-短L形、7-方四块、8-方九块
var Factory = {
    maps:
    [
        [   //一块
            [0,0,0,0,0, 0,0,1,0,0, 0,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0]
        ],
        [   //长两块
            [0,0,1,0,0, 0,0,1,0,0, 0,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0],
            [0,0,0,0,0, 0,0,1,1,0, 0,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0]
        ],
        [   //长三块
            [0,0,1,0,0, 0,0,1,0,0, 0,0,1,0,0, 0,0,0,0,0, 0,0,0,0,0],
            [0,0,0,0,0, 0,1,1,1,0, 0,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0]
        ],
        [   //长四块
            [0,0,1,0,0, 0,0,1,0,0, 0,0,1,0,0, 0,0,1,0,0, 0,0,0,0,0],
            [0,0,0,0,0, 1,1,1,1,0, 0,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0]
        ],
        [   //长五块
            [0,0,1,0,0, 0,0,1,0,0, 0,0,1,0,0, 0,0,1,0,0, 0,0,1,0,0],
            [0,0,0,0,0, 1,1,1,1,1, 0,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0]
        ],
        [   //长L形
            [0,1,0,0,0, 0,1,0,0,0, 0,1,1,1,0, 0,0,0,0,0, 0,0,0,0,0],
            [0,1,1,1,0, 0,1,0,0,0, 0,1,0,0,0, 0,0,0,0,0, 0,0,0,0,0],
            [0,1,1,1,0, 0,0,0,1,0, 0,0,0,1,0, 0,0,0,0,0, 0,0,0,0,0],
            [0,0,0,1,0, 0,0,0,1,0, 0,1,1,1,0, 0,0,0,0,0, 0,0,0,0,0]
        ],
        [   //短L形
            [0,1,0,0,0, 0,1,1,0,0, 0,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0],
            [0,1,1,0,0, 0,1,0,0,0, 0,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0],
            [0,0,1,1,0, 0,0,0,1,0, 0,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0],
            [0,0,0,1,0, 0,0,1,1,0, 0,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0]
        ],
        [   //方四块
            [0,1,1,0,0, 0,1,1,0,0, 0,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0]
        ],
        [   //方九块
            [0,1,1,1,0, 0,1,1,1,0, 0,1,1,1,0, 0,0,0,0,0, 0,0,0,0,0]
        ]
    ],
    index:0,    //方块索引号
    status:0,   //方块状态号
    createBlock: function(){    //生成一个新方块
        this.index = Math.floor(Math.random() * this.maps.length);
        this.status = Math.floor(Math.random() * this.maps[this.index].length);
        return this.getCurrentBlock();
    },
    getCurrentBlock: function(){
        return this.maps[this.index][this.status];
    }
};

$(document).ready(function(){
    prepareForMobile();
    newgame();
});

function prepareForMobile(){
    if(documentWidth * 0.91 >= 700){
        gridContainerWidth = 422;
        cellSideLength = 40;
        cellSpace = 2;
        dragContainerWidth = 358;
        dragCellSideLength = 20;
        dragCellSpace = 1;
    }

    $('#grid-container').css('width',gridContainerWidth - 2 * cellSpace);
    $('#grid-container').css('height',gridContainerWidth - 2 * cellSpace);
    $('#grid-container').css('padding',cellSpace);
    $('#grid-container').css('border-radius',0.02 * gridContainerWidth);

    $('.grid-cell').css('width',cellSideLength);
    $('.grid-cell').css('height',cellSideLength);
    $('.grid-cell').css('border-radius',0.15 * cellSideLength);

    $('#drag-container').css('width',dragContainerWidth - 2 * dragCellSpace);
    $('#drag-container').css('height',5 * dragCellSideLength + 6 * dragCellSpace);
    $('#drag-container').css('padding',dragCellSpace);
    $('#drag-container').css('border-radius',0.02 * dragContainerWidth);

    $('.drag-cell').css('width',dragCellSideLength);
    $('.drag-cell').css('height',dragCellSideLength);
    $('.drag-cell').css('border-radius',0.15 * dragCellSideLength);
}

function newgame(){
    //初始化棋盘
    init();
    //产生三个随机方块
    generateBlock();
}

function init(){    //棋盘初始化
    for(var i = 0; i < 10; i++){
        board[i] = new Array(10);
        for(var j = 0; j < 10; j++){
            board[i][j] = 0;
            var gridCell = $('#grid-cell-'+i+'-'+j);
            gridCell.css('top',getTop(i, j));
            gridCell.css('left',getLeft(i, j));
            gridCell.css('zIndex',"1");
            gridCell.css('background-color',"#e1e1e1");

            $("#grid-container").append( '<div class="block-cell" id="block-cell-'+i+'-'+j+'"></div>' );
            var theBlockCell = $('#block-cell-'+i+'-'+j);
            theBlockCell.css('line-height',cellSideLength);
            theBlockCell.css('top',getTop(i, j));
            theBlockCell.css('left',getLeft(i, j));
            theBlockCell.css('width',cellSideLength);
            theBlockCell.css('height',cellSideLength);
            theBlockCell.css('zIndex',"2");
            theBlockCell.css('border-radius',0.15 * cellSideLength);
            theBlockCell.css('background-color',"#e1e1e1");
        }
    }

    touching = false;
    score = 0;
    $('#score').text(score);
}

function generateBlock(){   //生成拖拽方块
    alreadyFill = 0;

    for(var i = 0; i < 3; i++){
        var dragBlock = $('#drag-block-'+i);
        dragBlock.css('left',getDragBlockLeft(i));
        dragBlock.css('top',"0px");
        dragBlock.css('width',"0px");
        dragBlock.css('height',"0px");
        dragBoard[i] = new Array(25);
        for(var j = 0; j < 5; j++){
            for(var k = 0; k < 5; k++){
                var dragCell = $('#drag-cell-'+i+'-'+j+'-'+k);
                dragCell.css('top',getDragTop(j, k));
                dragCell.css('left',getDragLeft(j, k));
                dragCell.css('background-color',"#ffffff");
                dragCell.css('width',dragCellSideLength);
                dragCell.css('height',dragCellSideLength);
                dragCell.css('border-radius',0.15*dragCellSideLength);
            }
        }
    }

    for(var i = 0; i < 3; i++){
        var block = Factory.createBlock();
        var flag = true;
        blockColor[i] = Factory.index;
        canClick[i] = true;
        for(var j = 0; j < 5; j++){
            for(var k = 0; k < 5; k++){
                var dragCell = $('#drag-cell-'+i+'-'+j+'-'+k);
                var dragCellColor = getDragCellColor(blockColor[i]);

                dragBoard[i][j*5+k] = block[j*5+k];

                if(block[j*5+k] == 1){
                    dragCell.css('background-color', dragCellColor);
                    dragCell.css('opacity',1);
                    if(flag){
                        overlapPoint[i].x = j;
                        overlapPoint[i].y = k;
                        flag = false;
                    }
                } else{
                    dragCell.css('opacity',0);
                }
            }
        }
        showDragBlock(i);

        dragFalse[i].left = getDragBlockLeft(i);
        dragFalse[i].top = "0px";
        dragFalse[i].width = 5 * dragCellSideLength + 6 * dragCellSpace;
        dragFalse[i].height = 5 * dragCellSideLength + 6 * dragCellSpace;

    }
}

function drag(elementToDrag, id, event){    //拖拽动作
    if(touching)    return ;
    if(!canClick[id])   return ;
    dragFalse[id].left = elementToDrag.style.left;
    dragFalse[id].top = elementToDrag.style.top;
    dragFalse[id].width = elementToDrag.style.width;
    dragFalse[id].height = elementToDrag.style.height;
    dragCellBigger(elementToDrag, id);
    var startX = event.clientX;
    var startY = event.clientY;
    var origX = elementToDrag.offsetLeft;
    var origY = elementToDrag.offsetTop;
    var deltaX = startX - origX;
    var deltaY = startY - origY;
    touchX = startX;
    touchY = startY;

    if(document.addEventListener){
        document.addEventListener("mousemove",moveHandler,true);
        document.addEventListener("mouseup",upHandler,true);
    } else {
        elementToDrag.setCapture();
        elementToDrag.attachEvent("onmousemove",moveHandler);
        elementToDrag.attachEvent("onmouseup",upHandler);
        elementToDrag.attachEvent("onlosecapture",upHandler);
    }

    if(event.stopPropagation) event.stopPropagation();
    else event.cancelBubble = true;
    if(event.preventDefault)    event.preventDefault();
    else    event.returnValue = false;

    function moveHandler(e){
        if(!e)  e = window.event;

        elementToDrag.style.left = (e.clientX - deltaX) + "px";
        elementToDrag.style.top = (e.clientY - deltaY) + "px";
        elementToDrag.style.zIndex = "10";

        if(e.stopPropagation)   e.stopPropagation();
        else    e.cancelBubble = true;
    }

    function upHandler(e){
        if(!e)  e = window.event;
        elementToDrag.style.zIndex = "1";

        if(document.removeEventListener){
            document.removeEventListener("mouseup",upHandler,true);
            document.removeEventListener("mousemove",moveHandler,true);
        } else {
            elementToDrag.detachEvent("onlosecapture",upHandler);
            elementToDrag.detachEvent("onmouseup",upHandler);
            elementToDrag.detachEvent("onmousemove",moveHandler);
            elementToDrag.releaseCapture();
        }

        if(e.stopPropagation)   e.stopPropagation();
        else    e.cancelBubble = true;

        if(dragSuccess(id)){
            fillGrid(id);
            flushDragCell(id);
            canClick[id] = false;
            alreadyFill++;
            if(alreadyFill == 3)    generateBlock();

            checkClear();
            setTimeout(checkGameOver(),1000);
        } else{
            elementToDrag.style.width = dragFalse[id].width;
            elementToDrag.style.height = dragFalse[id].height;
            elementToDrag.style.left = dragFalse[id].left;
            elementToDrag.style.top = dragFalse[id].top;
            elementToDrag.style.zIndex = "2";
            for(var i = 0; i < 5; i++){
                for(var j = 0; j < 5; j++){
                    var dragCell = $('#drag-cell-'+id+'-'+i+'-'+j);
                    dragCell.css('left',getDragLeft(i, j));
                    dragCell.css('top',getDragTop(i, j));
                    dragCell.css('width',dragCellSideLength);
                    dragCell.css('height',dragCellSideLength);
                    dragCell.css('border-radius',0.15*dragCellSideLength);
                }
            }
        }
        touching = false;
    }
}

document.addEventListener('touchstart',function(event){
    event.preventDefault();
    touchX = event.touches[0].pageX;
    touchY = event.touches[0].pageY;
    var btn = $('#newgamebtn');
    if(touchX >= btn.offset().left && touchX <= btn.offset().left + btn.width() &&
    touchY >= btn.offset().top && touchY <= btn.offset().top + btn.height()){
        newgame();
        return;
    }

    for(var i = 0; i < 3; i++){
        if(!canClick[i])    continue;
        var dragBlock = $('#drag-block-'+i);
        if(touchX >= dragBlock.offset().left && touchX <= dragBlock.offset().left + dragBlock.width() &&
        touchY >= dragBlock.offset().top && touchY <= dragBlock.offset().top + dragBlock.height()){
            touching = true;
            touchId = i;
            var elementToDrag = document.getElementById("drag-block-"+i);
            dragCellBigger(elementToDrag, i);

            touchDeltaX = touchX - elementToDrag.offsetLeft;
            touchDeltaY = touchY - elementToDrag.offsetTop;
            break;
        }
    }
});

document.addEventListener('touchmove',function(event){
    event.preventDefault();
    if(!touching)   return;

    var elementToDrag = document.getElementById("drag-block-"+touchId);
    elementToDrag.style.left = (event.touches[0].pageX - touchDeltaX) + "px";
    elementToDrag.style.top = (event.touches[0].pageY - touchDeltaY) + "px";
    elementToDrag.style.zIndex = "10";
});

document.addEventListener('touchend',function(event){
    event.preventDefault();
    if(!touching)   return ;
    touching = false;
    if(dragSuccess(touchId)){
        fillGrid(touchId);
        flushDragCell(touchId);
        canClick[touchId] = false;
        alreadyFill++;
        if(alreadyFill == 3)    generateBlock();

        checkClear();
        setTimeout(checkGameOver(),1000);
    } else{
        var dragBlock = $('#drag-block-'+touchId);
        dragBlock.css('width',dragFalse[touchId].width);
        dragBlock.css('height',dragFalse[touchId].height);
        dragBlock.css('left',dragFalse[touchId].left);
        dragBlock.css('top',dragFalse[touchId].top);
        dragBlock.css('z-index',"2");
        for(var i = 0; i < 5; i++){
            for(var j = 0; j < 5; j++){
                var dragCell = $('#drag-cell-'+touchId+'-'+i+'-'+j);
                dragCell.css('left',getDragLeft(i, j));
                dragCell.css('top',getDragTop(i, j));
                dragCell.css('width',dragCellSideLength);
                dragCell.css('height',dragCellSideLength);
                dragCell.css('border-radius',0.15*dragCellSideLength);
            }
        }
    }

});

function dragCellBigger(elementToDrag, id){     //点击时放大方块
    elementToDrag.style.width = 5 * cellSideLength + 6 * cellSpace + "px";
    elementToDrag.style.height = 5 * cellSideLength + 6 * cellSpace + "px";
    switch (id){
        case 0:elementToDrag.style.left = -1.3 * dragCellSideLength + "px";break;
        case 1:elementToDrag.style.left = 5 * dragCellSideLength + "px";break;
        case 2:elementToDrag.style.left = 12 * dragCellSideLength + "px";break;
    }
    elementToDrag.style.top = -1.8 * cellSideLength + "px";
    elementToDrag.style.zIndex = "10";
    for(var i = 0; i < 5; i++){
        for(var j = 0; j < 5; j++){
            var dragCell = $('#drag-cell-'+id+'-'+i+'-'+j);
            dragCell.css('left',getLeft(i, j));
            dragCell.css('top',getTop(i, j));
            dragCell.css('width',cellSideLength);
            dragCell.css('height',cellSideLength);
            dragCell.css('border-radius', 0.15*cellSideLength);
        }
    }
}

function dragSuccess(id){    //判断填充是否成功
    for(var i = 0; i < 10; i++){
        for(var j = 0; j < 10; j++){
            var X = overlapPoint[id].x;
            var Y = overlapPoint[id].y;
            if(isOverlap($('#drag-cell-'+id+'-'+X+'-'+Y), $('#grid-cell-'+i+'-'+j))){
                fillPoint.x = i;
                fillPoint.y = j;
                for(var p = 0; p < 5; p++){
                    for(var q = 0; q < 5; q++){
                        if(dragBoard[id][p*5+q] == 1){
                            if((i-X+p)>=0 && (i-X+p)<10 && (j-Y+q)>=0 && (j-Y+q)<10 && board[i-X+p][j-Y+q] == 0 &&
                                isOverlap($('#drag-cell-'+id+'-'+p+'-'+q), $('#grid-cell-'+(i-X+p)+'-'+(j-Y+q)))){
                                continue;
                            }
                            else    return false;
                        }
                    }
                }
                return true;
            }
        }
    }
    return false;
}

function isOverlap(aCell, bCell){   //判断两个方块是否重叠（即可填充）
    if(((aCell.offset().left<=bCell.offset().left+bCell.width()*0.44) && (aCell.offset().top<=bCell.offset().top+bCell.height()*0.44) &&
        (aCell.offset().left>=bCell.offset().left) && (aCell.offset().top>=bCell.offset().top)) ||
        ((aCell.offset().left<=bCell.offset().left+bCell.width()*0.44) && (aCell.offset().top>=bCell.offset().top-bCell.height()*0.44) &&
        (aCell.offset().left>=bCell.offset().left) && (aCell.offset().top<=bCell.offset().top)) ||
        ((aCell.offset().left>=bCell.offset().left-bCell.width()*0.44) && (aCell.offset().top<=bCell.offset().top+bCell.height()*0.44) &&
        (aCell.offset().left<=bCell.offset().left) && (aCell.offset().top>=bCell.offset().top)) ||
        ((aCell.offset().left>=bCell.offset().left-bCell.width()*0.44) && (aCell.offset().top>=bCell.offset().top-bCell.height()*0.44) &&
        (aCell.offset().left<=bCell.offset().left) && (aCell.offset().top<=bCell.offset().top)))
        return true;
    return false;
}

function fillGrid(id){  //方块填充
    var X = overlapPoint[id].x;
    var Y = overlapPoint[id].y;
    var i = fillPoint.x;
    var j = fillPoint.y;
    var color = getDragCellColor(blockColor[id]);
    var addScore = 0;
    for(var p = 0; p < 5; p++){
        for(var q = 0; q < 5; q++){
            if(dragBoard[id][p*5+q] == 1){
                addScore++;
                board[i-X+p][j-Y+q] = 1;
                $('#block-cell-'+(i-X+p)+'-'+(j-Y+q)).css('top',getTop(i-X+p, j-Y+q));
                $('#block-cell-'+(i-X+p)+'-'+(j-Y+q)).css('left',getLeft(i-X+p, j-Y+q));
                $('#block-cell-'+(i-X+p)+'-'+(j-Y+q)).css('width',cellSideLength);
                $('#block-cell-'+(i-X+p)+'-'+(j-Y+q)).css('height',cellSideLength);
                $('#block-cell-'+(i-X+p)+'-'+(j-Y+q)).css('background-color', color);
            }
        }
    }
    score += addScore;
    $('#score').text(score);
}

function flushDragCell(id){     //填充后刷新拖拽方块的状态
    $('#drag-block-'+id).css('width',"0px");
    $('#drag-block-'+id).css('height',"0px");
    for(var i = 0; i < 5; i++){
        for(var j = 0; j < 5; j++){
            $('#drag-cell-'+id+'-'+i+'-'+j).css('opacity',0);
            $('#drag-cell-'+id+'-'+i+'-'+j).css('width',"0px");
            $('#drag-cell-'+id+'-'+i+'-'+j).css("height","0px");
        }
    }
}

function checkClear(){  //检查是否可消除
    var canClear = false;
    for(var i = 0; i < 10; i++){
        var flag = 0;
        for(var j = 0; j < 10; j++){
            if(board[i][j] != 0)    flag++;
        }
        if(flag == 10){
            canClear = true;
            for(var j = 0; j < 10; j++){
                board[i][j] = 2;
            }
        }
    }
    for(var i = 0; i < 10; i++){
        var flag = 0;
        for(var j = 0; j < 10; j++){
            if(board[j][i] != 0)    flag++;
        }
        if(flag == 10){
            canClear = true;
            for(var j = 0; j < 10; j++){
                board[j][i] = 2;
            }
        }
    }
    if(!canClear)   return ;
    var addScore = 0;
    for(var i = 0; i < 10; i++){
        for(var j = 0; j < 10; j++){
            if(board[i][j] == 2){
                addScore++;
                showBlockClear(i, j);
                board[i][j] = 0;
            }
        }
    }
    score += addScore;
    $('#score').text(score);
}

function checkGameOver(){   //检查是否无路可走
    for(var i = 0; i < 3; i++){
        if(!canClick[i])    continue;
        if(canDrag(i)){
            return ;
        }
    }
    alert("哈哈哈！挂了吧！");
    newgame();
}

function canDrag(id){   //检查第id个方块是否可以填充
    var X = overlapPoint[id].x;
    var Y = overlapPoint[id].y;
    for(var i = 0; i < 10; i++){
        for(var j = 0; j < 10; j++){
            if(board[i][j] == 0){
                var flag = true;
                for(var p = 0; p < 5; p++){
                    for(var q = 0; q < 5; q++){
                        if(dragBoard[id][p*5+q] == 1){
                            if((i-X+p)>=10 || (i-X+p)<0 || (j-Y+p)>=10 || (j-Y+p)<0 || board[i-X+p][j-Y+q] != 0){
                                flag = false;
                                break;
                            }
                        }
                    }
                    if(!flag)   break;
                }
                if(flag)    return true;
            }
        }
    }
    return false;
}