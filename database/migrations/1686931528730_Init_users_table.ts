import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.string('email', 255).notNullable().unique()
      table.string('password', 180)
      table.string('remember_me_token')
      table.string('user_name').unique().notNullable()
      table.boolean('email_verified').defaultTo(false)
      table.string('avatar_url')
      table.string('oauth_token')

      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).notNullable()

      table.integer('membership_id').unsigned().references('memberships.id').defaultTo('1')
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
