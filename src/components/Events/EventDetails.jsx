import { useState } from 'react';
import { Link, Outlet, useNavigate, useParams } from 'react-router-dom';
import { useQuery,useMutation } from '@tanstack/react-query';
import Header from '../Header.jsx';
import { fetchEvent } from '../../util/http.js';
import ErrorBlock from '../UI/ErrorBlock.jsx';
import { deleteEvent } from '../../util/http.js';
import { client } from '../../util/http.js';
import Modal from "../UI/Modal.jsx";
export default function EventDetails() {
  const navitate=useNavigate();
  const[isDeleting,setDeleting]= useState(false);
  const params=useParams();

  const { data,isPending,isError,error}=useQuery({
    queryKey:["events" , params.id],
    queryFn:({signal}) => fetchEvent({signal,id:params.id})
  })

  const {mutate,isPending:isPendingDeletion,isError:isErrorDeletion,error:errorDeletion}=useMutation({
    mutationFn:deleteEvent,
    onSuccess:()=>{
      client.invalidateQueries({queryKey:["events"]
        ,refetchType:'none'
      }
      )
      navitate("/events")
    }
  })

  function handleStartDelete(){
    setDeleting(true);
  }

  function handleStopDelete(){
    setDeleting(false);
  }
  function handleDelete(){
    mutate({id:params.id})
  }
  let content;
   


  if(isPending){
    content=(<div id="event-details-content" className="center">
      <p>Fechting event data... </p>
    </div>)
  }
  if(isError){
    content=
    <div id="event-details-content" className="center">
      <ErrorBlock title="Failed to load event" message={error.info?.message|| "Failed to fetch event data"}/>
    </div>
  }
  if(data){
    const formattedDate=new Date(data.date).toLocaleDateString("en-US",{
      day:"numeric",
      month:"short",
      year:"numeric"
    })
    content=
      <>
      {isDeleting &&
        <Modal onClose={handleStopDelete}>
          <h2>Are you sure do deleete</h2>
          <p>Do you really want to delete forever?</p>
          <div className='form-actions'>
            {isPendingDeletion && <p>Deleting an event</p>}
            { !isPendingDeletion &&
              <>
                <button onClick={handleStopDelete} className='button-text'>Cancel</button>
                <button onClick={handleDelete} className='button'>Delete</button>
              </>
            }
          </div>
          {isErrorDeletion && <ErrorBlock title="Failed to delete event" message={deleteEvent.info?.message || 'failed to delete event, please try later'}></ErrorBlock>}
        </Modal>
      }
        <header>
          <h1>{data.title}</h1>
          <nav>
            <button onClick={handleStartDelete}>Delete</button>
            <Link to="edit">Edit</Link>
          </nav>
        </header>
        <div id="event-details-content">
          <img src={`http://localhost:3000/${data.image}`} alt={data.title} />
          <div id="event-details-info">
            <div>
              <p id="event-details-location">{data.location}</p>
              <time dateTime={`Todo-DateT$Todo-Time`}>{formattedDate} @ {data.time}</time>
            </div>
            <p id="event-details-description">{data.description}</p>
          </div>
        </div>
      </>
  }
  return (
    <>
      <Outlet />
      <Header>
        <Link to="/events" className="nav-item">
          View all Events
        </Link>
      </Header>
      <article id="event-details">
        {content}
      </article>
    </>
  );
}
