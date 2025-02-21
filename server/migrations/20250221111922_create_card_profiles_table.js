exports.up = function(knex) {
    return knex.schema.createTable("card_profiles", (table) => {
      table.increments("id").primary();
      table.string("card_name", 255).notNullable();
      table.string("bin_prefix", 10).notNullable();
      table.string("card_scheme", 50).notNullable();
      table.text("description");
      table.integer("expiration").notNullable();
      table.string("currency", 10).notNullable();
      table.string("branch_blacklist", 255);
      table.timestamp("created_at").defaultTo(knex.fn.now());
      table.timestamp("updated_at").defaultTo(knex.fn.now());
      table.uuid("user_id").references("id").inTable("users").onDelete("CASCADE");
      table.jsonb("fees").defaultTo("[]");
    });
  };
  
  exports.down = function(knex) {
    return knex.schema.dropTableIfExists("card_profiles");
  };
  