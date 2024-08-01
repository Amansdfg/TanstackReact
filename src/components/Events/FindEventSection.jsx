import { useRef ,useState} from 'react';
import {useQuery} from "@tanstack/react-query"
import { fetchEvents } from '../../util/http';
import LoadingIndicator from '../UI/LoadingIndicator';
import ErrorBlock from '../UI/ErrorBlock';
import EventItem from './EventItem';
export default function FindEventSection() {
  const searchElement = useRef();
  const[searchElementTerm,setSearchElementTerm]=useState('');
  const {data,isPending ,isError ,error}=useQuery({
    queryKey:['events',{searchElement:searchElementTerm}],
    queryFn:({signal})=>fetchEvents({signal,searchElementTerm})
  })
  function handleSubmit(event) {
    event.preventDefault();
    setSearchElementTerm(searchElement.current.value);
  }
  let content=<p>Please enter a search term and to find events.</p>;
  if(isPending){
    content=<LoadingIndicator/>
  }
  if(isError){
    content=<ErrorBlock title="An error occurred" message={error.info?.message|| 'error during fetch events'} />
  }
  if(data){
    content=
    <ul className="event-list">
      {data.map(event=>(
        <li key={event.id}>
          <EventItem event={event}/>
        </li>
      ))}
    </ul>
  }
  return (
    <section className="content-section" id="all-events-section">
      <header>
        <h2>Find your next event!</h2>
        <form onSubmit={handleSubmit} id="search-form">
          <input
            type="search"
            placeholder="Search events"
            ref={searchElement}
          />
          <button>Search</button>
        </form>
      </header>
     {content} 
    </section>
  );
}
