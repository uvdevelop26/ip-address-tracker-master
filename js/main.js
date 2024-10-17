const fetchData = async (url) => {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Error en la búsqueda: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error(error);
        alert(error)
    }
}

const infoContainer = document.querySelector('#info');
const searchButton = document.querySelector('#searchButton');


const map = L.map('map').setView([51.505, -0.09], 13);
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);


const showData = (data) => {
    const ipAddress = infoContainer.querySelector('#ipAddress');
    const location = infoContainer.querySelector('#location');
    const timezone = infoContainer.querySelector('#timezone');
    const isp = infoContainer.querySelector('#isp');

    ipAddress.textContent = data.ip;
    location.textContent = `${data.location.region}, ${data.location.country}`;
    timezone.textContent = `UTC ${data.location.timezone}`;
    isp.textContent = data.isp;

    /* muestra la ubicación en el mapa */
    const { lat, lng } = data.location;
    map.setView([lat, lng], 13);

    L.marker([lat, lng]).addTo(map)
        .bindPopup(`IP: ${data.ip}<br>Location: ${data.location.region}, ${data.location.country}`)
        .openPopup();

}

/* verificar si el valor ingresado es una IP */
const isIpAddress = (value) => {
    const ipPattern = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    return ipPattern.test(value);
}

const clearForm = (searchInput) => {
    searchInput.value = "";
}


searchButton.addEventListener('click', async () => {
    const searchInput = searchButton.previousElementSibling;
    const value = searchInput.value;

    if (value) {
        let apiUrl;

        if (isIpAddress(value)) {
            /* busqueda por ip */
            apiUrl = `https://geo.ipify.org/api/v2/country,city?apiKey=at_ElU2WsV5lI3iil8Qy41im4QWUpk0H&ipAddress=${value}`;
        } else {
            /* búsqueda por dominio */
            apiUrl = `https://geo.ipify.org/api/v2/country,city?apiKey=at_ElU2WsV5lI3iil8Qy41im4QWUpk0H&domain=${value}`;
        }

        const data = await fetchData(apiUrl);
        if (data) showData(data);
    }

    clearForm(searchInput)

});


document.addEventListener('DOMContentLoaded', async () => {
    const currentIp = await fetchData('https://api64.ipify.org?format=json');
    if (currentIp) {
        const data = await fetchData(`https://geo.ipify.org/api/v2/country,city?apiKey=at_ElU2WsV5lI3iil8Qy41im4QWUpk0H&ipAddress=${currentIp.ip}`);
        if (data) showData(data);
    }
});
