import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.post('/login', 'AuthController.login').as('login')
  Route.post('/register', 'AuthController.register').as('register')
  Route.post('/logout', 'AuthController.logout').as('logout')
  Route.get('/github', 'AuthController.github').as('github')
  Route.get('/github/callback', 'AuthController.githubCallback').as('githubCallback')
  Route.get('/google', 'AuthController.google').as('google')
  Route.get('/google/callback', 'AuthController.googleCallback').as('googleCallback')
})
  .prefix('auth')
  .as('auth')
