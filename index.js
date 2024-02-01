const API_URL = `https://fsa-crud-2aa9294fe819.herokuapp.com/api/2311-FSA-ET-WEB-PT-SF/events`;
const eventElement = document.querySelector('#events');
const addPartyForm = document.querySelector('#addParty');
addPartyForm.addEventListener('submit', addEvent);

const state = {events : []};

async function render() {
    await getEvent();
    renderEvent();
};

render();

async function getEvent() {
    try {
        const response = await fetch(API_URL);
        const json = await response.json();
        state.events = json.data;
        console.log(state)
    } catch (error) {
        console.error(error);
    }
};

function renderEvent() {
    if(state.events.length === 0) {
        eventElement.innerHTML = '<li>No Events</li>';
        return;
    }

    const eventPost = state.events.map((i) => {
        const li = document.createElement('li');
        li.innerHTML = `
        <h2 class='name'>${i.name}</h2>
        <h3 class='date'>Date: ${i.date.slice(0, 10)}</h3>
        <h3 class='location'>Where: ${i.location}</h3>
        <p class='description'>${i.description}</p>
        <button class='delete' id='${i.id}'>Delete</button>
        `;
        const deleteButton = li.querySelector('.delete');
        deleteButton.addEventListener('click', deleteEvent);
        return li;
    });
    eventElement.replaceChildren(...eventPost);
    console.log(state.events);
}

async function addEvent(event) {
    event.preventDefault();
    const id = 7826;
    
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                cohortId: 70,
                date: new Date(addPartyForm.date.value),
                description: addPartyForm.description.value,
                id: id,
                location: addPartyForm.location.value,
                name: addPartyForm.name.value,
            }),
        });
        render();
        
        if (!response.ok) {
            throw new Error(`Failed to create Event. Status: ${response.status}`);
        };
    } catch (error) {
        console.error(error);
    }

};


async function deleteEvent(event) {
    event.preventDefault();

    const target = event.target.id;
    
    try {
        const response = await fetch(API_URL + `/${target}`, {
            method: 'DELETE',
        });
    render();

        if (response.ok){
            state.events = state.events.filter((i) => i.id !== target);
        } else {
            throw new Error('Failed to Delete Event');
        }
    
    } catch (error) {
        console.error(error);
    }
}

