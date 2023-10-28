import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import User from '../../Models/User'

export default class AuthController {
  public async register({ request, response, auth }: HttpContextContract) {
    const userSchema = schema.create({
      email: schema.string([rules.email(), rules.trim()]),
      password: schema.string([rules.minLength(8)]),
    })

    const data = await request.validate({ schema: userSchema })
    const user = await User.create(data)

    await auth.login(user)
    response.redirect().toPath('/account')
  }

  public async login({ request, response, session, auth }: HttpContextContract) {
    const { email, password } = request.only(['email', 'password'])
    try {
      await auth.attempt(email, password)
      response.redirect().toRoute('account.index')
    } catch (error) {
      console.log(error)
      session.flashAll()
      session.flash('errors', 'Something wrong with your input')
      response.redirect().back()
    }
  }

  public async logout({ response, auth }: HttpContextContract) {
    await auth.logout()
    response.redirect().toPath('/')
  }

  public async github({ ally }: HttpContextContract) {
    return ally.use('github').redirect()
  }
  public async githubCallback({ ally, auth, response }: HttpContextContract) {
    const github = ally.use('github')

    if (github.accessDenied()) {
      return 'Access was denied'
    }

    if (github.stateMisMatch()) {
      return 'Request expired. Retry again'
    }

    if (github.hasError()) {
      return github.getError()
    }

    const githubUser = await github.user()

    const user = await User.firstOrCreate(
      {
        email: githubUser.email ?? '',
      },
      {
        email: githubUser.email ?? '',
        userName: githubUser.original?.login,
        emailVerified: githubUser.emailVerificationState === 'verified',
        oauthToken: githubUser.token.token,
        avatarUrl: githubUser.avatarUrl ?? '',
      }
    )
    await auth.use('web').login(user)

    return response.redirect().toRoute('account.index')
  }

  public async google({ ally }: HttpContextContract) {
    return ally.use('google').redirect()
  }
  public async googleCallback({ ally, auth, response }: HttpContextContract) {
    const google = ally.use('google')

    if (google.accessDenied()) {
      return 'Access was denied'
    }

    if (google.stateMisMatch()) {
      return 'Request expired. Retry again'
    }

    if (google.hasError()) {
      return google.getError()
    }

    const googleUser = await google.user()

    const user = await User.firstOrCreate(
      {
        email: googleUser.email ?? '',
      },
      {
        email: googleUser.email ?? '',
        userName: googleUser.nickName,
        emailVerified: googleUser.emailVerificationState === 'verified',
        oauthToken: googleUser.token.token,
        avatarUrl: googleUser.avatarUrl ?? '',
      }
    )
    await auth.use('web').login(user)

    return response.redirect().toRoute('account.index')
  }
}
