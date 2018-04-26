let template = document.querySelector("#eventTemp").content;
let eventList = document.querySelector("#events");
let plusButton = document.querySelector(".pagePlus");
let urlParams = new URLSearchParams(window.location.search);

let catid = urlParams.get("category");
let page = 1;
let totalPages = 0

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
        .then(showMusicEvt);
}

function showEvents(data) {
    console.log(data);
    data.forEach(showSingleEvent)
}

function showMusicEvt(data) {
    console.log(data);
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

    clone.querySelector(".cat").textContent = anEvent.type;


    eventList.appendChild(clone);
}
fetchEvents();
fetchMusicEvt();

plusButton.addEventListener('click', function () {
    page++;
    if (page <= totalPages) {
        fetchEvents();
        fetchMusicEvt();
    } else {
        plusButton.classList.add("dontDisplay");
    }
})

//BUILD MENU
fetch("http://soperfect.dk/kea/07-cms/wp00/wp-json/wp/v2/categories?_embed&per_page=25")
    .then(e => e.json())
    .then(buildMenu)

function buildMenu(data) {
    let parentElement = document.querySelector(".slideMenu ul")
    let burger = document.querySelector(".burgerMenu").addEventListener('click', function () {
        console.log("clicked")
        let menu = document.querySelector(".slideMenu").classList.remove("dontDisplay");
    });
    data.forEach(item => {
        console.log(item);
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
