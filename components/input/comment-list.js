import classes from './comment-list.module.css';

function CommentList({ comments }) {
  return (
    <ul className={classes.comments}>
      {/* Render list of comments - fetched from API */}
      {comments.map((commentData) => (
        <li key={commentData.id}>
          <p>{commentData.text}</p>
          <div>
            By <address>{commentData.name}</address>
          </div>
        </li>
      ))}
    </ul>
  );
}

export default CommentList;
