import { useContext } from 'react';
import MainHeader from './main-header';
import NotificationContext from '../../store/notification-context';
import Notification from '../ui/notification';

function Layout(props) {
  const notificationContext = useContext(NotificationContext);
  const { notification } = notificationContext;
  const { title, message, status } = notification || {};

  return (
    <>
      <MainHeader />
      <main>{props.children}</main>
      {notification && (
        <Notification title={title} message={message} status={status} />
      )}
    </>
  );
}

export default Layout;
