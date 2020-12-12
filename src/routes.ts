import RoomPage from './pages/room.svelte'
import ThreadPage from './pages/thread.svelte'

export default [
  {
    path: '/',
    component: RoomPage,
    // specify home route as master route
    master: true,
    // detail routes
    detailRoutes: [
     {
      path: '/thread/:threadId',
      component: ThreadPage,
      options: {
            transition: 'f7-push',
          }
        },
      ],
  },
]