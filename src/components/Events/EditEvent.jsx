import { Link, useNavigate, useParams } from 'react-router-dom';
import {useQuery,useMutation, queryOptions} from "@tanstack/react-query";
import Modal from '../UI/Modal.jsx';
import EventForm from './EventForm.jsx';
import { client, fetchEvent,updateEvent } from '../../util/http.js';
import LoadingIndicator from "../UI/LoadingIndicator.jsx";
import ErroBlock from "../UI/ErrorBlock.jsx";
export default function EditEvent() {
  const navigate = useNavigate();
  const params=useParams();
  const {data,isPending,isError,error}=useQuery({
    queryKey:['/events',params.id],
    queryFn:({signal})=>fetchEvent({signal,id:params.id}),
  })
  const { mutate } = useMutation({
    mutationFn: updateEvent,
    onMutate: async (data) => {
      const newEvent = data.event;

      await client.cancelQueries({ queryKey: ['events', params.id] });
      const previousEvent = client.getQueryData(['events', params.id]);

      client.setQueryData(['events', params.id], newEvent);

      return { previousEvent };
    },
    onError: (error, data, context) => {
      client.setQueryData(['events', params.id], context.previousEvent);
    },
    onSettled: () => {
      client.invalidateQueries(['events', params.id]);
    }
  });

  
  function handleSubmit(formData) {
    mutate({id:params.id,event:formData});
    navigate("../")
  }

  function handleClose() {
    navigate('../');
  }
  let content;
  if(isPending){
    content=
    <div className='center'>
      <LoadingIndicator/>
    </div>
  }
  if(data){
    content=<EventForm inputData={data} onSubmit={handleSubmit}>
    <Link to="../" className="button-text">
      Cancel
    </Link>
    <button type="submit" className="button">
      Update
    </button>
  </EventForm>
  }
  if(isError){
    content=<>
      <ErroBlock title="Failed to feching event" message={error.info?.message || "Failed to fechting event ,Please try again"}/>
      <div className="form-actions">
        <Link to="../" className='button'>
          Okey
        </Link>
      </div>
    </>
  }
  return (
    <Modal onClose={handleClose}>
      {content}
   </Modal>
  );
}
