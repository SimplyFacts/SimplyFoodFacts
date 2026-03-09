import sql from "@/app/api/utils/sql";

function getDeviceId(request) {
  return request.headers.get("x-device-id");
}

// Toggle alert active status (scoped to device)
export async function PATCH(request, { params }) {
  try {
    const deviceId = getDeviceId(request);
    if (!deviceId) {
      return Response.json({ error: "Missing device ID" }, { status: 400 });
    }

    const { id } = params;
    const body = await request.json();
    const { active } = body;

    if (typeof active !== "boolean") {
      return Response.json(
        { error: "active field must be a boolean" },
        { status: 400 },
      );
    }

    const result = await sql`
      UPDATE ingredient_alerts 
      SET active = ${active}
      WHERE id = ${id} AND device_id = ${deviceId}
      RETURNING *
    `;

    if (result.length === 0) {
      return Response.json({ error: "Alert not found" }, { status: 404 });
    }

    return Response.json({ success: true, alert: result[0] });
  } catch (error) {
    console.error("Error toggling alert:", error);
    return Response.json({ error: "Failed to toggle alert" }, { status: 500 });
  }
}

// Delete ingredient alert (scoped to device)
export async function DELETE(request, { params }) {
  try {
    const deviceId = getDeviceId(request);
    if (!deviceId) {
      return Response.json({ error: "Missing device ID" }, { status: 400 });
    }

    const { id } = params;

    await sql`
      DELETE FROM ingredient_alerts WHERE id = ${id} AND device_id = ${deviceId}
    `;

    return Response.json({ success: true });
  } catch (error) {
    console.error("Error deleting alert:", error);
    return Response.json({ error: "Failed to delete alert" }, { status: 500 });
  }
}
