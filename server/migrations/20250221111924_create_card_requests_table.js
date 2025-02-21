exports.up = function(knex) {
    return knex.schema.createTable("card_requests", (table) => {
      table.increments("id").primary();
      table.string("branch_name", 255).notNullable();
      table.string("card_type", 100).notNullable();
      table.integer("quantity").notNullable();
      table.timestamp("date_requested").defaultTo(knex.fn.now());
      table.uuid("initiator").notNullable().references("id").inTable("users").onDelete("CASCADE");
      table.decimal("card_charges", 10, 2).notNullable();
      table.string("batch", 50).notNullable().unique();
      table.string("status", 50).defaultTo("Pending");
      table.timestamp("created_at").defaultTo(knex.fn.now());
      table.timestamp("updated_at").defaultTo(knex.fn.now());
    });
  };
  
  exports.down = function(knex) {
    return knex.schema.dropTableIfExists("card_requests");
  };
  