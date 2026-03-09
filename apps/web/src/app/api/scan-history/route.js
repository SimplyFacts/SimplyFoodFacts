import sql from "@/app/api/utils/sql";

function getDeviceId(request) {
  return request.headers.get("x-device-id");
}

// Track last cleanup time in memory (resets on server restart, which is fine)
let lastCleanup = null;

// Get scan history for this device (with periodic cleanup of old records)
export async function GET(request) {
  try {
    const deviceId = getDeviceId(request);
    if (!deviceId) {
      return Response.json({ error: "Missing device ID" }, { status: 400 });
    }

    // Only clean up old records once per day
    const now = Date.now();
    const oneDayMs = 24 * 60 * 60 * 1000;

    if (!lastCleanup || now - lastCleanup > oneDayMs) {
      await sql`
        DELETE FROM scan_history
        WHERE scanned_at < NOW() - INTERVAL '30 days'
      `;
      lastCleanup = now;
    }

    // Return recent history for this device (deduplicated by barcode)
    const rows = await sql`
      SELECT * FROM (
        SELECT DISTINCT ON (barcode) *
        FROM scan_history
        WHERE device_id = ${deviceId}
        ORDER BY barcode, scanned_at DESC
      ) AS recent_scans
      ORDER BY scanned_at DESC
      LIMIT 50
    `;

    return Response.json(rows);
  } catch (error) {
    console.error("Error fetching scan history:", error);
    return Response.json(
      { error: "Failed to fetch scan history" },
      { status: 500 },
    );
  }
}

// Add to scan history for this device
export async function POST(request) {
  try {
    const deviceId = getDeviceId(request);
    if (!deviceId) {
      return Response.json({ error: "Missing device ID" }, { status: 400 });
    }

    const body = await request.json();
    const { barcode, product_name } = body;

    if (!barcode) {
      return Response.json({ error: "Barcode is required" }, { status: 400 });
    }

    const rows = await sql`
      INSERT INTO scan_history (barcode, product_name, device_id)
      VALUES (${barcode}, ${product_name || null}, ${deviceId})
      RETURNING *
    `;

    return Response.json(rows[0]);
  } catch (error) {
    console.error("Error adding to scan history:", error);
    return Response.json(
      { error: "Failed to add to scan history" },
      { status: 500 },
    );
  }
}

// Clear all scan history for this device
export async function DELETE(request) {
  try {
    const deviceId = getDeviceId(request);
    if (!deviceId) {
      return Response.json({ error: "Missing device ID" }, { status: 400 });
    }

    await sql`DELETE FROM scan_history WHERE device_id = ${deviceId}`;
    return Response.json({ success: true, message: "History cleared" });
  } catch (error) {
    console.error("Error clearing scan history:", error);
    return Response.json(
      { error: "Failed to clear scan history" },
      { status: 500 },
    );
  }
}
