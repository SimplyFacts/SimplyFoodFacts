import sql from "@/app/api/utils/sql";

// Track last cleanup time in memory (resets on server restart, which is fine)
let lastCleanup = null;

// Get scan history (with periodic cleanup of old records)
export async function GET(request) {
  try {
    // Only clean up old records once per day
    const now = Date.now();
    const oneDayMs = 24 * 60 * 60 * 1000;

    if (!lastCleanup || now - lastCleanup > oneDayMs) {
      // Clean up old records (older than 30 days)
      await sql`
        DELETE FROM scan_history
        WHERE scanned_at < NOW() - INTERVAL '30 days'
      `;
      lastCleanup = now;
    }

    // Return the recent history (deduplicated - only most recent scan per barcode)
    // Ordered by newest scans first
    const rows = await sql`
      SELECT * FROM (
        SELECT DISTINCT ON (barcode) *
        FROM scan_history
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

// Add to scan history
export async function POST(request) {
  try {
    const body = await request.json();
    const { barcode, product_name } = body;

    if (!barcode) {
      return Response.json({ error: "Barcode is required" }, { status: 400 });
    }

    const rows = await sql`
      INSERT INTO scan_history (barcode, product_name)
      VALUES (${barcode}, ${product_name || null})
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

// Clear all scan history
export async function DELETE(request) {
  try {
    await sql`DELETE FROM scan_history`;
    return Response.json({ success: true, message: "History cleared" });
  } catch (error) {
    console.error("Error clearing scan history:", error);
    return Response.json(
      { error: "Failed to clear scan history" },
      { status: 500 },
    );
  }
}
