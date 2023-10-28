import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Membership from '../../app/Models/Membership'
import { MembershipTypes } from '../../app/enums/database'

export default class extends BaseSeeder {
  public async run() {
    await Membership.createMany([
      {
        id: MembershipTypes.FREE,
        name: 'free',
      },
      {
        id: MembershipTypes.PRO,
        name: 'pro',
        price: 5.0,
      },
      {
        id: MembershipTypes.PREMIUM,
        name: 'premium',
        price: 10,
      },
    ])
  }
}
