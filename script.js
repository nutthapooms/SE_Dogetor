
var jhin = ["url(jhino.jpg)","url(jhin.jpg)","url(jhinb.jpg)","url(jhinh.jpg)"]
var countt = 0;
document.body.style.backgroundImage = jhin[countt];
document.getElementById("Home").setAttribute("href","https://na.leagueoflegends.com/en/game-info/champions/Jhin/");

document.getElementById("virtuoso").addEventListener("click", change);
function change(){
	if(countt==3){
		countt = 0;
	}
	else{
		countt+=1;
	}	
	document.body.style.backgroundImage = jhin[countt];	
}
