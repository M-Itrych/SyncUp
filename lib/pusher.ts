import Pusher from 'pusher';
import PusherClient from 'pusher-js';

export const pusherServer = new Pusher({
  appId: '1972824',
  key: '3457c8beb2a561c40850',
  secret: '7c14f44cc3572ce0c66a',
  cluster: 'eu',
  useTLS: true,
});

export const pusherClient = new PusherClient(
  '3457c8beb2a561c40850',
  {
    cluster: 'eu',
    wsHost: 'ws-eu.pusher.com',
    wsPort: 80,
    forceTLS: true,
    disableStats: true,
  }
);