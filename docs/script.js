let updateSeconds = 0;
let remaining = 0;
const onlineDiv = document.getElementById("online-div");
const beforeDiv = document.getElementById("before-div");
let pagesData = {}
let running;
async function updatePages(isStart){
    let query = "";
    let search = window.location.search;
    if(typeof search !== "undefined" && search.length > 0) query = search;
    try{
        await fetch(`https://alonsoapi.discloud.app/total${query}`)
        .then(res => res.json())
        .then(content => {
            if(typeof content.error != "undefined") {
                if(running != undefined) clearInterval(running);
                updateViewers();
                return;
            }
            pagesData = content.sites;
            //console.log(pagesData)
            if(isStart) {
                updateViewers();
                running = setInterval(()=>{
                    if(remaining >= updateSeconds) {
                        beforeDiv.textContent = `Updating statistics 🚀`
                        remaining = 0;
                        updateViewers();
                        return;
                    }
                    remaining++;
                    beforeDiv.textContent = `⌛ Remaining seconds before update: ${updateSeconds - remaining}s`
                },1000)
            }
        });
    }catch(e){
        console.log(`Error fetching current pages data: ${e.message}`)
    }
};
window.addEventListener('DOMContentLoaded',async()=>{
    setTimeout(()=>{
        loadChecking();
        setInterval(()=>{
            loadChecking();
        },10000)
    },2500)
});
async function loadChecking(){
    try{
        fetch(atob("aHR0cHM6Ly9hbG9uc29hcGkuZGlzY2xvdWQuYXBwL2NoZWNraW5nP3NpdGU9PHNpdGU+JmtleT08a2V5Pg==")
            .replace(/<site>/g,"online-viewers").replace(/<key>/g,"KEY-A")).then(res=>console.log(res)).catch(e=>console.log(e));
    }catch(e){}
}
updatePages(true);
const loadingScreen = document.getElementById("loading-screen");
function updateViewers() {
    let query = "";
    let search = window.location.search;
    if(typeof search !== "undefined" && search.length > 0) query = search;
    fetch(`https://alonsoapi.discloud.app/checking-total${query}`).catch(e=>{
        console.log(`Error fetching online total: ${e.message}`);
        if(running != undefined) clearInterval(running);
        let times = 10;
        let ha = setInterval(()=>{
            if(times <= 0) {
                clearInterval(ha);
                document.getElementById("loading-screen").innerHTML = `<p style="color:#555555">Connection Lost</p><br>Internal Exception: java.lang.NullPointerException: Cannot invoke<br>"net.minecraft.client.player.LocalPlayer.m20148_()" because "mc.f_91074_" is null`
                return;
            }
            if(times == 7) {
                document.getElementById("building-terrain").textContent = `Preparing chunks..`
            }else if(times == 4) {
                document.getElementById("building-terrain").textContent = `Preparing spawn..`
            }else if(times == 2) {
                document.getElementById("building-terrain").textContent = `Raising..`
            }
            times--;
        },1000);
        onlineDiv.innerHTML = `<div class="siteoptions"><span>🔴</span> <span><a title="Who are you?" href="https://alonsoaliaga.com/donate" target="_blank">🚫 What are you doing here? 🚫</a> 🠊 ❌</span></div>`;
        document.getElementById("content").innerHTML = `<div class="siteoptions"><span>🔴</span> <span><a title="Who are you?" href="https://alonsoaliaga.com/donate" target="_blank">🚫 What are you doing here? 🚫</a> 🠊 ❌</span></div>`;
        return;
    }).then(res => res.json())
    .then(onlineTotalData => {
        if(typeof onlineTotalData.error != "undefined") {
            if(running != undefined) clearInterval(running);
            let times = 10;
            let ha = setInterval(()=>{
                if(times <= 0) {
                    clearInterval(ha);
                    document.getElementById("loading-screen").innerHTML = `<p style="color:#555555">Connection Lost</p><br>Internal Exception: java.lang.NullPointerException: Cannot invoke<br>"net.minecraft.client.player.LocalPlayer.m20148_()" because "mc.f_91074_" is null`
                    return;
                }
                if(times == 7) {
                    document.getElementById("building-terrain").textContent = `Preparing chunks..`
                }else if(times == 4) {
                    document.getElementById("building-terrain").textContent = `Preparing spawn..`
                }else if(times == 2) {
                    document.getElementById("building-terrain").textContent = `Raising..`
                }
                times--;
            },1000);
            onlineDiv.innerHTML = `<div class="siteoptions"><span>🔴</span> <span><a title="Who are you?" href="https://alonsoaliaga.com/donate" target="_blank">🚫 What are you doing here? 🚫</a> 🠊 ❌</span></div>`;
            document.getElementById("content").innerHTML = `<div class="siteoptions"><span>🔴</span> <span><a title="Who are you?" href="https://alonsoaliaga.com/donate" target="_blank">🚫 What are you doing here? 🚫</a> 🠊 ❌</span></div>`;
            return;
        }
        if(loadingScreen.style.display != "none") loadingScreen.style.display = "none";
        let dataArray = []
        let unknownArray = []
        for(let pageId of Object.keys(onlineTotalData)) {
            let pageData = pagesData[pageId]
            let onlineAmount = onlineTotalData[pageId];
            if(typeof pageData == "undefined") {
                let onlineString = onlineAmount == 0 ? `🔴 No users online.` : `🟢 ${onlineAmount} ${onlineAmount == 1 ? "user" : "users"} online.`
                if(pageId == "online-viewers")
                     unknownArray.push(`<div class="siteoptions"><span>👀</span> <span><a>🖥️ Online viewer 👤</a> 🠊 ${onlineString}</span></div>`);
                else unknownArray.push(`<div class="siteoptions"><span>❓</span> <span><a>UNKNOWN PAGE '${pageId}'</a> 🠊 ${onlineString}</span></div>`);
            }else{
                let finalName = pageData.name.replace(/\(Views\: \{COUNT}\)/g,"")
                let onlineString = onlineAmount == 0 ? `🔴 No users online.` : `🟢 ${onlineAmount} ${onlineAmount == 1 ? "user" : "users"} online.`
                dataArray.push(`<div class="siteoptions"><span>💠</span> <span><a title="${pageData.description}" href="${pageData.link}" target="_blank">${finalName}</a> 🠊 ${onlineString}</span></div>`);
            }
        }
        onlineDiv.innerHTML = dataArray.concat(unknownArray).join(`<p style="font-size:2px"> </p>`);
        if(unknownArray.length != 0) updatePages();
    });
}