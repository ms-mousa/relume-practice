import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from '../../Models/User'

export default class UsersController {
  public async index({}: HttpContextContract) {}

  public async create({}: HttpContextContract) {
    const newUser = new User()

    newUser.userName = 'msmo'
    newUser.email = 'ma@ma.com'
    newUser.password = 'mamama'

    newUser.save()

    return newUser
  }

  public async store({}: HttpContextContract) {}

  public async show({ params }: HttpContextContract) {
    const selectedUser = await User.findOrFail(params.id)
    await selectedUser.load('membership')
    return selectedUser
  }

  public async edit({}: HttpContextContract) {}

  public async update({}: HttpContextContract) {}

  public async destroy({}: HttpContextContract) {}
}
