export async function fetchEvents({signal,searhElement}) {
  const url='http://localhost:3000/events';
  if(searhElement){
    url+="?search="+searhElement;
  }
      const response = await fetch(url,{signal:signal});

      if (!response.ok) {
        const error = new Error('An error occurred while fetching the events');
        error.code = response.status;
        error.info = await response.json();
        throw error;
      }

      const { events } = await response.json();

      return events;
    }