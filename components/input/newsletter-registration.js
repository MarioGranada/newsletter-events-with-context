import { useContext, useRef } from 'react';
import classes from './newsletter-registration.module.css';
import NotificationContext from '../../store/notification-context';

function NewsletterRegistration() {
  const emailInputRef = useRef();
  const notificationContext = useContext(NotificationContext);

  async function registrationHandler(event) {
    event.preventDefault();

    const enteredEmail = emailInputRef.current.value;

    notificationContext.showNotification({
      title: 'Registering...',
      message: 'Registering for newsletter.',
      status: 'pending',
    });

    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        body: JSON.stringify({ email: enteredEmail }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(response.data.message || 'Something went wrong!');
      }

      const data = await response.json();

      notificationContext.showNotification({
        title: 'Success!',
        message: 'Successfully registered for newsletter.',
        status: 'success',
      });

      console.log(data);
    } catch (error) {
      console.error(error.message);
      notificationContext.showNotification({
        title: 'Error!',
        message: 'Failed to register for newsletter.',
        status: 'error',
      });
    }
  }

  return (
    <section className={classes.newsletter}>
      <h2>Sign up to stay updated!</h2>
      <form onSubmit={registrationHandler}>
        <div className={classes.control}>
          <input
            type="email"
            id="email"
            placeholder="Your email"
            aria-label="Your email"
            ref={emailInputRef}
          />
          <button>Register</button>
        </div>
      </form>
    </section>
  );
}

export default NewsletterRegistration;
