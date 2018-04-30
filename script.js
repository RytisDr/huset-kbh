let template = document.querySelector("#eventTemp").content;
let eventList = document.querySelector("#events");
let plusButton = document.querySelector(".pagePlus");
let urlParams = new URLSearchParams(window.location.search);

let catid = urlParams.get("category");
let page = 1;

let endpoints = ['music_events', 'movies'];
let totalPages = [0, 0];
function fetchData(){
    endpoints.forEach(endp =>{
        let endpoint = "http://soperfect.dk/kea/07-cms/wp00/wp-json/wp/v2/"+endp+"?_embed&order=asc&per_page=2&page=" + page
        if (catid) {
            endpoint = "http://soperfect.dk/kea/07-cms/wp00/wp-json/wp/v2/"+endp+"?_embed&order=asc&per_page=2&page=" + page + "&categories=" + catid
        }
        fetch(endpoint)
            .then(e => {
                  totalPages = e.headers.get("X-WP-TotalPages")
                    console.log(totalPages[1])
                return e.json()

            })

            .then(showEvents);
        })
}
/*THE LONG VERSION
function fetchMusicEvt() {
    let endpoint = "http://soperfect.dk/kea/07-cms/wp00/wp-json/wp/v2/music_events?_embed&order=asc&per_page=2&page=" + page
    if (catid) {
        endpoint = "http://soperfect.dk/kea/07-cms/wp00/wp-json/wp/v2/music_events?_embed&order=asc&per_page=2&page=" + page + "&categories=" + catid
    }
    fetch(endpoint)
        .then(e => {
            totalPages = e.headers.get("X-WP-TotalPages")
            return e.json()
        })
        .then(showEvents);
}

function fetchEvents() {
    let endpoint = "http://soperfect.dk/kea/07-cms/wp00/wp-json/wp/v2/movies?_embed&order=asc&per_page=2&page=" + page

    if (catid) {
        endpoint = "http://soperfect.dk/kea/07-cms/wp00/wp-json/wp/v2/movies?_embed&order=asc&per_page=2&page=" + page + "&categories=" + catid
    }
    fetch(endpoint)
        .then(e => {
            totalPages = e.headers.get("X-WP-TotalPages")
            return e.json()
        })
        .then(showEvents);
}*/

function showEvents(data) {
    data.forEach(showSingleEvent)
}



function showSingleEvent(anEvent) {

    let clone = template.cloneNode(true);
    clone.querySelector(".title").textContent = anEvent.title.rendered;
    //FORMAT THE DATE
    let date = anEvent.acf.date
    let match = date.match(/(\d{4})(\d{2})(\d{2})/);
    let formattedDate = match[1] + '.' + match[2] + '.' + match[3];
    ///////////////////
    clone.querySelector(".date").textContent = formattedDate;
    clone.querySelector(".imgPlace").style.backgroundImage = "url(" + anEvent.acf.image.sizes.medium + ")"
    clone.querySelector(".genre").textContent = anEvent.acf.genre

    let category = clone.querySelector(".cat")
    category.textContent = anEvent.type;
    if(anEvent.type.includes("_")){
        category.textContent = category.textContent.replace("_", " ")
    }
    eventList.appendChild(clone);
}
//fetchEvents();
//fetchMusicEvt();
fetchData();
if (page <= totalPages){
    plusButton.classList.remove("dontDisplay");
plusButton.addEventListener('click', function () {
   /* page++;
    if (page <= totalPages[0] || page <=totalPages[1]) {
        //fetchEvents();
        //fetchMusicEvt();
        fetchData();
    } else{
        plusButton.classList.add("dontDisplay");
    }*/
})}

//BUILD MENU
fetch("http://soperfect.dk/kea/07-cms/wp00/wp-json/wp/v2/categories?_embed&per_page=25")
    .then(e => e.json())
    .then(buildMenu)

function buildMenu(data) {
    let parentElement = document.querySelector(".slideMenu ul")
    let burger = document.querySelector(".burgerMenu")
    burger.addEventListener('click', function slideMenu () {
        burger.classList.add("burgerTransform");
        let menu = document.querySelector(".slideMenu").classList.toggle("hidden");
        burger.addEventListener('click', function(){
            burger.classList.remove("burgerTransform");
            burger.style.animation="moveArrow 1s reverse forwards";
            /*burger.classList.replace("burgerTransform", "burgerTransformBack");*/
            //burger.style.animationDirection="reverse";
        })
    });
    data.forEach(item => {
        if (item.count > 0 && item.parent === 41 || item.parent === 7) {
            let li = document.createElement("li");
            let a = document.createElement("a");
            a.textContent = item.name;
            a.href = "index.html?category=" + item.id;
            li.appendChild(a);
            parentElement.appendChild(li);
        }
    })
}
