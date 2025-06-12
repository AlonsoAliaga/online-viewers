let updateSeconds = 0;
let remaining = 0;
const onlineDiv = document.getElementById("online-div");
const beforeDiv = document.getElementById("before-div");
let pagesData = {}
async function updatePages(isStart){
    try{
        await fetch('https://alonsoapi.discloud.app/total?key=Whatever')
        .then(res => res.json())
        .then(content => {
            pagesData = content.sites;
            //console.log(pagesData)
            if(isStart) {
                updateViewers();
                setInterval(()=>{
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
updatePages(true);
function updateViewers() {
    let query = "";
    let search = window.location.search;
    if(typeof search !== "undefined" && search.length > 0) query = search;
    fetch(`https://alonsoapi.discloud.app/checking-total${query}`).catch(e=>{
        console.log(`Error fetching online total: ${e.message}`);
        onlineDiv.innerHTML = `<div class="siteoptions"><span>🔴</span> <span><a title="Who are you?" href="https://alonsoaliaga.com/donate" target="_blank">🚫 What are you doing here? 🚫</a> 🠊 ❌</span></div>`
    }).then(res => res.json())
    .then(onlineTotalData => {
        if(typeof onlineTotalData.error != "undefined") {
            onlineDiv.innerHTML = `<div class="siteoptions"><span>🔴</span> <span><a title="Who are you?" href="https://alonsoaliaga.com/donate" target="_blank">🚫 What are you doing here? 🚫</a> 🠊 ❌</span></div>`;
            document.body.innerHTML = `<div class="siteoptions"><span>🔴</span> <span><a title="Who are you?" href="https://alonsoaliaga.com/donate" target="_blank">🚫 What are you doing here? 🚫</a> 🠊 ❌</span></div>`;
            return;
        }
        let dataArray = []
        let unknownArray = []
        for(let pageId of Object.keys(onlineTotalData)) {
            let pageData = pagesData[pageId]
            let onlineAmount = onlineTotalData[pageId];
            if(typeof pageData == "undefined") {
                unknownArray.push(`<div class="siteoptions"><span>❓</span> <span><a>Unknown page ${pageId}: ${onlineAmount}</a></span></div>`);
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