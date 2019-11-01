let arr = [];
let playerTaken = {
	cnt: 0,
	row: -1,
};
let playerLim = 3;

function rand(l,r) {
	return l+Math.floor(Math.random()*(r-l+1));
}

function sum(arr) {
	let s = 0;
	for(let x of arr) s += x;
	return s;
}

function takeStone(row) {
	--arr[row];
	let stone = $(`#stone-${row}-${arr[row]}`);
	if(arr[row] != 0)
		stone.width('0px');
	else
		stone.css('opacity', '0');
	$(`#cnt${row}`).text(`${arr[row]}`);
}

function playerTake(row) {
	if(playerTaken == null) return;
	if(arr[row] == 0) {
		alert("You cannot take stone in a empty pile");
		return;
	}
	if(playerTaken.row != -1 && playerTaken.row != row) {
		alert("You can take one pile in one move");
		return;
	}
	takeStone(row);
	playerTaken.row = row;
	playerTaken.cnt++;
	if(arr[row] == 0 || playerTaken.cnt == playerLim) comTake();
}

function comCalc(arr) {
	let xor_sum = 0;
	for(let i = 0; i < arr.length; i++) xor_sum ^= arr[i]%playerLim;
	let moves = [];
	if(xor_sum == 0) {
		for(let i = 0; i < arr.length; i++) for(let j = 1; j <= playerLim && j <= arr[i]; j++) {
			moves.push({
				cnt: j,
				row: i,
			});
		}
	}else {
		for(let i = 0; i < arr.length; i++) if(arr[i] - (arr[i]^xor_sum) <= playerLim && (arr[i]^xor_sum) < arr[i]) {
			moves.push({
				cnt: arr[i] - (arr[i]^xor_sum),
				row: i,
			});
		}
	}
	return moves;
}

function comTake() {
	if(playerTaken.cnt == 0) {
		alert("You haven't move yet!");
		return;
	}
	playerTaken = null;
	$(`#ready`).hide();
	if(sum(arr) == 0) {
		alert("Player Win!");
		return;
	}
	let moves = comCalc(arr);
	let m = moves[rand(0,moves.length-1)];
	let delay_time = 500 / m.cnt;
	for(let i = 0; i < m.cnt; i++) {
		setTimeout(takeStone, delay_time*(i+1), m.row);
	}
	setTimeout(function() {
		if(sum(arr) == 0) alert("Computer Win!");
		$(`#ready`).show();
		playerTaken = {
			cnt: 0,
			row: -1,
		};
	}, delay_time*(m.cnt+1));
}

function showRule() {
	window.open("https://hackmd.io/Wolwkk29QhWdPLOjvpcepQ");
}

function showTuto() {
	window.open("https://hackmd.io/p8NFDRJ8TkqPxg4JLp51hQ");
}

function getHint() {
	let arr = prompt("input some integers, split by spaces").split(' ');
	let moves = comCalc(arr);
	let m = moves[rand(0,moves.length-1)];
	alert(arr[m.row] + " " + m.cnt);
}

function init(n,C) {
	arr = []
	let sum = 0;
	for(let i = 0; i < n-1; i++) {
		let x = rand(1,C);
		arr.push(x);
		sum ^= x%playerLim;
	}
	while(arr.length < n) {
		let x = rand(1,C);
		if(((x%playerLim)^sum) != 0) arr.splice(rand(0,arr.length), 0, x);
	}
	for(let i = 0; i < n; i++) {
		$(`body`).append(`<span class="badge badge-pill badge-success" id="cnt${i}" style="font-size: 40px">${arr[i]}</span>`);
		let bgstyle = i&1 ? "badge-light" : "badge-dark";
		$(`body`).append(`<div class="badge badge-pill ${bgstyle}" style="font-size: 40px" id="row${i}" onclick="playerTake(${i})">`);
		for(let j = 0; j < arr[i]; j++) $(`#row${i}`).append(`<img src="cobbleStone.png" class="stone" id="stone-${i}-${j}">`);
		$(`body`).append(`</div><br>`);
	}
	$(`body`).append(`
		<!-- <button id="init" class="btn btn-info" style="font-size: 25px" onclick="customInit()"> Init </button> -->
		<button id="reset" class="btn btn-info" style="font-size: 25px" onclick="location.reload()"> Reset </button>
		<!-- <button id="rules" class="btn btn-info" style="font-size: 25px" onclick="showRule()"> Rules </button> -->
		<button id="hint"  class="btn btn-info" style="font-size: 25px" onclick="getHint()"> Hint </button>
		<!-- <button id="tutor" class="btn btn-info" style="font-size: 25px" onclick="showTuto()"> Tutorial </button> -->
		<button id="ready" class="btn btn-info" style="font-size: 25px" onclick="comTake()"> OK! </button>
	`);
}
init(6,9);