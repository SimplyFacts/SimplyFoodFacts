import sql from "@/app/api/utils/sql";

// Toggle alert active status
export async function PATCH(request, { params }) {
  try {
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
      WHERE id = ${id}
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

// Delete ingredient alert (permanent deletion)
export async function DELETE(request, { params }) {
  try {
    const { id } = params;

    await sql`
      DELETE FROM ingredient_alerts WHERE id = ${id}
    `;

    return Response.json({ success: true });
  } catch (error) {
    console.error("Error deleting alert:", error);
    return Response.json({ error: "Failed to delete alert" }, { status: 500 });
  }
}
