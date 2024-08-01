import {QueryClient} from "@tanstack/react-query"

export  const client=new QueryClient();

export async function fetchEvents({ signal, searchTerm }) {
  console.log(searchTerm);
  let url = 'http://localhost:3000/events';

  if (searchTerm) {
    url += '?search=' + searchTerm;
  }

  const response = await fetch(url, { signal: signal });

  if (!response.ok) {
    const error = new Error('An error occurred while fetching the events');
    error.code = response.status;
    error.info = await response.json();
    throw error;
  }

  const { events } = await response.json();

  return events;
}


export async function createNewEvent(eventData) {
  const response = await fetch(`http://localhost:3000/events`, {
    method: 'POST',
    body: JSON.stringify(eventData),
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const error = new Error('An error occurred while creating the event');
    error.code = response.status;
    error.info = await response.json();
    throw error;
  }

  const { event } = await response.json();

  return event;
}
export async function fetchImages(){
  const response=await fetch("http://localhost:3000/events/images");
  if(!response.ok){
    const error=new Error("Error occured during fetching images");
    error.code=response.status;
    error.info = await response.json();
    throw error;
  }
  const {images}=await response.json();
  return images;
}
export async function fetchEvent({signal,id}){
  const response=await fetch(`http://localhost:3000/events/${id}`,{signal});
  if(!response.ok){
    const error=new Error("An error occured during get image");
    error.code=response.status;
    error.info=await response.json();
    throw error;
  }
  const {event}=await response.json();
  return event;
}
export async function deleteEvent({id}){
  const response=await fetch(`http://localhost:3000/events/${id}`,{
    method:"DELETE"
  })
  if(!response.ok){
    const error=new Error("An error occured during delete an image");
    error.code=response.status;
    error.info=await response.json();
    throw error;
  }
}