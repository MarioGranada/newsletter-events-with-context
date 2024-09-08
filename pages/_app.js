import Head from 'next/head';
import Layout from '../components/layout/layout';
import '../styles/globals.css';
import { NotificationProvider } from '../store/notification-context';

function MyApp({ Component, pageProps }) {
  return (
    <NotificationProvider>
      <Layout>
        <Head>
          <title>Next Events</title>
          <meta name="description" content="NextJS Events" />
          <meta
            name="viewport"
            content="initial-scale=1.0, width=device-width"
          />
        </Head>
        <Component {...pageProps} />
      </Layout>
    </NotificationProvider>
  );
}

export default MyApp;
