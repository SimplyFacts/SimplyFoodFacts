import sql from "@/app/api/utils/sql";

// Batch create ingredient alerts
export async function POST(request) {
  try {
    const body = await request.json();
    const { ingredients } = body;

    if (
      !ingredients ||
      !Array.isArray(ingredients) ||
      ingredients.length === 0
    ) {
      return Response.json(
        { error: "An array of ingredient names is required" },
        { status: 400 },
      );
    }

    // Filter out empty strings
    const validIngredients = ingredients
      .map((name) => (typeof name === "string" ? name.trim() : ""))
      .filter((name) => name.length > 0);

    if (validIngredients.length === 0) {
      return Response.json(
        { error: "No valid ingredient names provided" },
        { status: 400 },
      );
    }

    // Get existing active alerts to avoid duplicates
    const existing = await sql`
      SELECT ingredient_name FROM ingredient_alerts WHERE active = true
    `;
    const existingNames = new Set(
      existing.map((row) => row.ingredient_name.toLowerCase().trim()),
    );

    // Filter to only new ingredients
    const newIngredients = validIngredients.filter(
      (name) => !existingNames.has(name.toLowerCase().trim()),
    );

    if (newIngredients.length === 0) {
      return Response.json({
        added: [],
        skipped: validIngredients.length,
        message: "All ingredients already have active alerts",
      });
    }

    // Insert all new ingredients using a transaction with tagged templates
    const rows = await sql.transaction(
      newIngredients.map(
        (name) =>
          sql`INSERT INTO ingredient_alerts (ingredient_name, alert_type, active)
              VALUES (${name}, 'warning', true)
              RETURNING *`,
      ),
    );

    // sql.transaction returns an array of result arrays — flatten to get all rows
    const insertedRows = rows.flat();

    return Response.json({
      added: insertedRows,
      skipped: validIngredients.length - newIngredients.length,
      message: `Added ${insertedRows.length} new alert(s)`,
    });
  } catch (error) {
    console.error("Error batch creating alerts:", error);
    return Response.json(
      { error: "Failed to batch create alerts" },
      { status: 500 },
    );
  }
}
