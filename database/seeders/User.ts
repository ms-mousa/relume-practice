import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import User from '../../app/Models/User'

export default class extends BaseSeeder {
  public async run() {
    await User.createMany([
      {
        userName: 'msmo',
        email: 'ma@ma.com',
        password: 'admin123',
      },
    ])
  }
}
