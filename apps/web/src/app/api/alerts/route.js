import sql from "@/app/api/utils/sql";

function getDeviceId(request) {
  return request.headers.get("x-device-id");
}

// List all ACTIVE ingredient alerts for this device
export async function GET(request) {
  try {
    const deviceId = getDeviceId(request);
    if (!deviceId) {
      return Response.json({ error: "Missing device ID" }, { status: 400 });
    }

    const rows = await sql`
      SELECT * FROM ingredient_alerts 
      WHERE active = true AND device_id = ${deviceId}
      ORDER BY created_at DESC
    `;

    return Response.json(rows);
  } catch (error) {
    console.error("Error fetching alerts:", error);
    return Response.json({ error: "Failed to fetch alerts" }, { status: 500 });
  }
}

// Create new ingredient alert for this device
export async function POST(request) {
  try {
    const deviceId = getDeviceId(request);
    if (!deviceId) {
      return Response.json({ error: "Missing device ID" }, { status: 400 });
    }

    const body = await request.json();
    const { ingredient_name, alert_type, notes } = body;

    if (!ingredient_name) {
      return Response.json(
        { error: "Ingredient name is required" },
        { status: 400 },
      );
    }

    const rows = await sql`
      INSERT INTO ingredient_alerts (ingredient_name, alert_type, notes, active, device_id)
      VALUES (${ingredient_name}, ${alert_type || "warning"}, ${notes || null}, true, ${deviceId})
      RETURNING *
    `;

    return Response.json(rows[0]);
  } catch (error) {
    console.error("Error creating alert:", error);
    return Response.json({ error: "Failed to create alert" }, { status: 500 });
  }
}

// Clear all ingredient alerts for this device
export async function DELETE(request) {
  try {
    const deviceId = getDeviceId(request);
    if (!deviceId) {
      return Response.json({ error: "Missing device ID" }, { status: 400 });
    }

    await sql`UPDATE ingredient_alerts SET active = false WHERE device_id = ${deviceId}`;
    return Response.json({ success: true, message: "All alerts deactivated" });
  } catch (error) {
    console.error("Error clearing alerts:", error);
    return Response.json({ error: "Failed to clear alerts" }, { status: 500 });
  }
}
