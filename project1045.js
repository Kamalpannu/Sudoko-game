let boardArray = [];
boardArray[0] = ["", new Piece(0, 2, "red"), "", new Piece(0, 4, "red"), "", new Piece(0, 6, "red"), "", new Piece(0, 8, "red")];
boardArray[1] = [new Piece(1, 1, "red"), "", new Piece(1, 3, "red"), "", new Piece(1, 5, "red"), "", new Piece(1, 7, "red"), ""];
boardArray[2] = ["", new Piece(2, 2, "red"), "", new Piece(2, 4, "red"), "", new Piece(2, 6, "red"), "", new Piece(2, 8, "red")];
boardArray[3] = ["", "", "", "", "", "", "", ""];
boardArray[4] = ["", "", "", "", "", "", "", ""];
boardArray[5] = [new Piece(5, 1, "gray"), "", new Piece(5, 3, "gray"), "", new Piece(5, 5, "gray"), "", new Piece(5, 7, "gray"), ""];
boardArray[6] = ["", new Piece(6, 2, "gray"), "", new Piece(6, 4, "gray"), "", new Piece(6, 6, "gray"), "", new Piece(6, 8, "gray")];
boardArray[7] = [new Piece(7, 1, "gray"), "", new Piece(7, 3, "gray"), "", new Piece(7, 5, "gray"), "", new Piece(7, 7, "gray"), ""];

let canvas = document.getElementById("projectCanvas");
let ctx = canvas.getContext("2d");

canvas.width=800;
canvas.height=800;

function drawBoard() {
    for (let i = 0; i < boardArray.length; i++) {
        for (let j = 0; j < boardArray[i].length; j++) {
            let x = j * 100;
            let y = i * 100;
            if ((i + j) % 2 == 0) {
                ctx.fillStyle = "white";
                ctx.fillRect(x, y, 100, 100);
            } else {
                ctx.fillStyle = "black";
                ctx.fillRect(x, y, 100, 100);
            }
        }
    }
}

function drawPieces() {
    for (let i = 0; i < boardArray.length; i++) {
        for (let j = 0; j < boardArray[i].length; j++) {
            let myPiece = boardArray[i][j];
            if (myPiece instanceof Piece) {
                myPiece.draw();
            }
        }
    }
}

function Piece(row, col, color) {
    this.row = row;
    this.col = col;
    this.color = color;
    this.isClicked = false;
    this.isKing = false;
    this.draw = function () {
        let x = (this.col-1) * 100;
        let y = this.row * 100;
        if (this.isClicked) {
            ctx.fillStyle = "yellow";
            ctx.beginPath();
            ctx.arc(x + 50, y + 50, 40, 0, 2 * Math.PI);
            ctx.fill();
        }
        
        
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(x + 50, y + 50, 30, 0, 2 * Math.PI);
        ctx.fill();

        if(this.isKing){
            ctx.fillStyle = "white";
            ctx.beginPath();
            ctx.arc(x + 35, y + 35, 5, 0, 2 * Math.PI);
            ctx.arc(x + 65, y + 35, 5, 0, 2 * Math.PI); 
            ctx.moveTo(x + 30, y + 50);
            ctx.arc(x + 50, y + 50, 20, 0, Math.PI); 
            ctx.stroke();
        }
    };
    
    this.checkKing = function(){
        if((this.color=="red" && this.row==7)||(this.color=="gray" && this.row==0)){
            this.isKing=true;
        }
    }
    this.move = function(newRow, newCol) {
        boardArray[this.row][this.col] = ""; 
        this.row = newRow;
        this.col = newCol;
        boardArray[newRow][newCol] = this; 
        this.checkKing(); 
    };
    
    this.isValidMove = function(newRow,newCol){
        if(boardArray[newRow][newCol] !== null && boardArray[newRow][newCol] !== undefined){
            return false;

        }
        if((this.color == "red"||this.isKing == true) && newRow == this.row + 1 && (newCol == this.col-1 || newCol == this.col+1) && (newRow + newCol) % 2 !== 0 && boardArray[newRow][newCol] == ""){
            alert("this is valid");
            return true;    
        }
        if((this.color == "gray"||this.isKing == true) && newRow == this.row + 1 && (newCol == this.col-1 || newCol == this.col+1) && (newRow + newCol) % 2 !== 0 && boardArray[newRow][newCol] == ""){
            return true;
        }
        if (((this.color === "red" || this.isKing) && newRow === this.row + 2 && (newCol == this.col-2 || newCol == this.col+2)) ||((this.color === "gray" || this.isKing) && newRow === this.row - 2 && (newCol == this.col-2 || newCol == this.col+2))){
            let midRow=(newRow+this.row)/2;
            let midCol=(newCol+this.col)/2;
            if(boardArray[midRow][midCol]!=="" && boardArray[midRow][midCol].color!==this.color){
                boardArray[midRow][midCol]="";
                return true;
            }else{
                return false;
            }
         }
         return false;
    }
}

drawBoard();
drawPieces();

canvas.addEventListener("click", function(event) {
    let XCoord = event.offsetX;
    let YCoord = event.offsetY;
    let row = Math.floor(YCoord / 100);
    let column = Math.floor(XCoord / 100);

    let selectedPiece = getSelectedPiece();

    if (selectedPiece !== null) {
        if (selectedPiece.isValidMove(row, column)) {
            selectedPiece.move(row, column);
        }
        selectedPiece.isClicked = false;
    } else {
        if (boardArray[row][column] instanceof Piece) {
            boardArray[row][column].isClicked = !boardArray[row][column].isClicked;
        }
    }

    drawBoard();
    drawPieces();
});



function getSelectedPiece() {
    for (let i = 0; i < boardArray.length; i++) {
        for (let j = 0; j < boardArray[i].length; j++) {
            if (boardArray[i][j] instanceof Piece && boardArray[i][j].isClicked) {
                return boardArray[i][j];
            }
        }
    }
    return null;
}
