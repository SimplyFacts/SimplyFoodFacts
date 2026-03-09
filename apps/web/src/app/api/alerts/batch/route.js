import sql from "@/app/api/utils/sql";

function getDeviceId(request) {
  return request.headers.get("x-device-id");
}

// Batch create ingredient alerts for this device
export async function POST(request) {
  try {
    const deviceId = getDeviceId(request);
    if (!deviceId) {
      return Response.json({ error: "Missing device ID" }, { status: 400 });
    }

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

    // Get existing active alerts for this device to avoid duplicates
    const existing = await sql`
      SELECT ingredient_name FROM ingredient_alerts 
      WHERE active = true AND device_id = ${deviceId}
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

    // Insert all new ingredients
    const rows = await sql.transaction(
      newIngredients.map(
        (name) =>
          sql`INSERT INTO ingredient_alerts (ingredient_name, alert_type, active, device_id)
              VALUES (${name}, 'warning', true, ${deviceId})
              RETURNING *`,
      ),
    );

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
