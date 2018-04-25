let template = document.querySelector("#eventTemp").content;
let eventList = document.querySelector("#events");
let plusButton = document.querySelector("#pagePlus")
let page = 1;

function fetchEvents() {
    let urlParams = new URLSearchParams(window.location.search);

    let catid = urlParams.get("category");
    let endpoint = "http://soperfect.dk/kea/07-cms/wp00/wp-json/wp/v2/movies?_embed&per_page=3&page=" + page
    if (catid) {
        endpoint = "http://soperfect.dk/kea/07-cms/wp00/wp-json/wp/v2/movies?_embed&per_page=3&page=" + page + "&categories=" + catid
    }
    fetch(endpoint)
        .then(e => e.json())
        .then(showEvents);
}

function showEvents(data) {
    console.log(data);
    data.forEach(showSingleEvent)
}

function showSingleEvent(anEvent) {

    let clone = template.cloneNode(true);
    clone.querySelector(".title").textContent = anEvent.title.rendered;
    //FOMAT THE DATE
    let date = anEvent.acf.date
    let match = date.match(/(\d{4})(\d{2})(\d{2})/);
    let formattedDate = match[1] + '.' + match[2] + '.' + match[3];
    ///////////////////
    clone.querySelector(".date").textContent = formattedDate;
    clone.querySelector(".imgPlace").style.backgroundImage = "url(" + anEvent.acf.image.sizes.medium + ")"
    clone.querySelector(".genre").textContent = anEvent.acf.genre

    eventList.appendChild(clone);
}
fetchEvents();
plusButton.addEventListener('click', function () {
    page++;
    fetchEvents();
})
