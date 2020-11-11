import StoriesPage from './pages/stories.svelte'
import StoryPage from './pages/story.svelte'

export default [
  {
    path: '/',
    component: StoriesPage,
    master: true,
    detailRoutes: [
      {
        path: '/item/:id',
        component: StoryPage,
      },
    ]
  },
]