import { useContext, useEffect, useState } from 'react';

import CommentList from './comment-list';
import NewComment from './new-comment';
import classes from './comments.module.css';
import NotificationContext from '../../store/notification-context';

function Comments(props) {
  const { eventId } = props;
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState([]);
  const notificationCtx = useContext(NotificationContext);

  useEffect(() => {
    const fetchComments = async () => {
      const response = await fetch(`/api/comments/${eventId}`);
      const data = await response.json();
      console.log(data);
      setComments(data.comments);
    };

    if (showComments) {
      fetchComments();
    }
  }, [showComments]);

  function toggleCommentsHandler() {
    setShowComments((prevStatus) => !prevStatus);
  }

  async function addCommentHandler(commentData) {
    notificationCtx.showNotification({
      title: 'Sending comment...',
      message: 'Your comment is currently being stored',
      status: 'pending',
    });

    try {
      const response = await fetch(`/api/comments/${eventId}`, {
        method: 'POST',
        body: JSON.stringify(commentData),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(response.data.message || 'Something went wrong!');
      }

      const data = await response.json();

      notificationCtx.showNotification({
        title: 'Success!',
        message: 'Your comment was saved',
        status: 'success',
      });
      console.log(data);
    } catch (error) {
      console.error(error.message);
      notificationCtx.showNotification({
        title: 'Error!',
        message: 'Something went wrong!',
        status: 'error',
      });
    }
  }

  return (
    <section className={classes.comments}>
      <button onClick={toggleCommentsHandler}>
        {showComments ? 'Hide' : 'Show'} Comments
      </button>
      {showComments && <NewComment onAddComment={addCommentHandler} />}
      {showComments && <CommentList comments={comments} />}
    </section>
  );
}

export default Comments;
