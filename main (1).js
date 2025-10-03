let points = 0;
let badges = 0;
let level = 1;
let leaderboard = JSON.parse(localStorage.getItem("ecoLeaderboard")) || [];

const contentArea = document.getElementById("contentArea");
const pointsEl = document.getElementById("points");
const badgesEl = document.getElementById("badges");
const levelEl = document.getElementById("level");
const progressBar = document.getElementById("progressBar");

const correctSound = document.getElementById("correctSound");
const wrongSound = document.getElementById("wrongSound");
const levelUpSound = document.getElementById("levelUpSound");

// Utility functions
function updateProgress(pts){
    points += pts;
    if(points >= level*50){
        level++;
        badges++;
        levelUpSound.play();
        alert(`🎉 Level Up! Now Level ${level}`);
    }
    pointsEl.textContent = points;
    badgesEl.textContent = badges;
    levelEl.textContent = level;
    let percent = Math.min((points/(level*50))*100,100);
    progressBar.style.width = percent + "%";
}

// Quiz Module
document.getElementById("quizBtn").addEventListener("click", () => {
    contentArea.innerHTML = `
        <h2>Quiz: Environmental Awareness</h2>
        <p>Where should plastic bottles go?</p>
        <button id="optA">🌊 Water</button>
        <button id="optB">🗑️ Bin</button>
        <button id="optC">🛣️ Road</button>
    `;

    document.getElementById("optB").onclick = () => { correctSound.play(); alert("Correct! ✅ +10 points"); updateProgress(10);}
    document.getElementById("optA").onclick = document.getElementById("optC").onclick = () => { wrongSound.play(); alert("Wrong! ❌ Try again."); }
});

// Drag & Drop
document.getElementById("dragBtn").addEventListener("click", () => {
    contentArea.innerHTML = `
        <h2>Mini-Game: Trash Sorting</h2>
        <p>Drag the trash into the bin!</p>
        <div id="bin" style="width:100px;height:100px;background:#795548;margin:20px auto;border-radius:12px;position:relative;"></div>
        <div id="trash" style="width:60px;height:60px;background:brown;position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);cursor:grab;border-radius:10px;"></div>
    `;
    const trash = document.getElementById("trash");
    const bin = document.getElementById("bin");

    trash.onmousedown = function(e) {
        let shiftX = e.clientX - trash.getBoundingClientRect().left;
        let shiftY = e.clientY - trash.getBoundingClientRect().top;

        function moveAt(pageX,pageY){ trash.style.left = pageX - shiftX - contentArea.getBoundingClientRect().left + "px"; trash.style.top = pageY - shiftY - contentArea.getBoundingClientRect().top + "px";}

        function onMouseMove(event){ moveAt(event.pageX,event.pageY);}
        document.addEventListener("mousemove",onMouseMove);

        trash.onmouseup = function(){
            document.removeEventListener("mousemove",onMouseMove);
            trash.onmouseup=null;
            const binRect = bin.getBoundingClientRect();
            const trashRect = trash.getBoundingClientRect();
            if(trashRect.left < binRect.right && trashRect.right > binRect.left &&
               trashRect.top < binRect.bottom && trashRect.bottom > binRect.top){
                trash.remove();
                correctSound.play();
                alert("Trash sorted! +20 points");
                updateProgress(20);
            }
        }
    }
    trash.ondragstart = ()=>false;
});

// Click Match Game
document.getElementById("clickMatchBtn").addEventListener("click",()=>{
    contentArea.innerHTML = `<h2>Mini-Game: Click the Plant!</h2><p>Click the 🌱 to earn points!</p><div id="grid" style="display:grid;grid-template-columns:repeat(3,100px);grid-gap:10px;margin-top:20px;"></div>`;
    const grid = document.getElementById("grid");
    let plantIndex = Math.floor(Math.random()*9);
    for(let i=0;i<9;i++){
        const cell = document.createElement("div");
        cell.style.width="100px";
        cell.style.height="100px";
        cell.style.background="#a5d6a7";
        cell.style.display="flex";
        cell.style.alignItems="center";
        cell.style.justifyContent="center";
        cell.style.borderRadius="10px";
        cell.style.cursor="pointer";
        if(i===plantIndex){ cell.textContent="🌱"; cell.onclick=()=>{ correctSound.play(); alert("Plant clicked! +15 points"); updateProgress(15);}}
        else{ cell.onclick=()=>{ wrongSound.play(); alert("Wrong! ❌ Try again.");}}
        grid.appendChild(cell);
    }
});

// Leaderboard
document.getElementById("leaderboardBtn").addEventListener("click",()=>{
    contentArea.innerHTML="<h2>Leaderboard</h2>";
    leaderboard.push({points,badges,level});
    leaderboard.sort((a,b)=>b.points-a.points);
    localStorage.setItem("ecoLeaderboard",JSON.stringify(leaderboard));
    const list = document.createElement("ol");
    leaderboard.slice(0,5).forEach(item=>{
        const li = document.createElement("li");
        li.textContent=`Points:${item.points} | Badges:${item.badges} | Level:${item.level}`;
        list.appendChild(li);
    });
    contentArea.appendChild(list);
});
