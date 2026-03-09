import sql from "@/app/api/utils/sql";

// Helper function to filter out false positive allergens
function filterFalsePositiveAllergens(allergens, productName, ingredients) {
  if (!allergens || allergens.length === 0) return allergens;

  const productText = `${productName || ""} ${ingredients || ""}`.toLowerCase();

  // Plant-based milk alternatives
  const plantMilkPatterns = [
    "almond milk",
    "oat milk",
    "soy milk",
    "coconut milk",
    "rice milk",
    "cashew milk",
    "hemp milk",
    "pea milk",
    "macadamia milk",
    "hazelnut milk",
    "flax milk",
  ];

  // Actual dairy ingredients
  const dairyPatterns = [
    "whey",
    "casein",
    "lactose",
    "butter",
    "cream",
    "yogurt",
    "cheese",
    "milk powder",
    "skim milk",
    "whole milk",
    "dairy",
    "goat milk",
    "goat cheese",
    "goat butter",
    "goat cream",
    "goat yogurt",
    "chèvre",
    "chevre",
    "sheep milk",
    "sheep cheese",
    "feta",
    "manchego",
    "pecorino",
    "roquefort",
    "sheep yogurt",
    "ewe milk",
    "ewe's milk",
    "buffalo milk",
    "buffalo mozzarella",
    "mozzarella di bufala",
    "camel milk",
    "mare milk",
    "mare's milk",
  ];

  return allergens.filter((allergen) => {
    const allergenLower = allergen.toLowerCase();

    // If this is a milk allergen tag
    if (allergenLower.includes("milk") || allergenLower === "en:milk") {
      // Check if it's a plant-based milk product
      const hasPlantMilk = plantMilkPatterns.some((pattern) =>
        productText.includes(pattern),
      );

      // Check if it actually contains dairy
      const hasDairy = dairyPatterns.some((pattern) =>
        productText.includes(pattern),
      );

      // Only show milk allergen if it has dairy OR doesn't have plant milk
      return hasDairy || !hasPlantMilk;
    }

    return true; // Keep all other allergens
  });
}

// Get product by barcode
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const barcode = searchParams.get("barcode");

    if (!barcode) {
      return Response.json({ error: "Barcode is required" }, { status: 400 });
    }

    const rows = await sql`
      SELECT * FROM products WHERE barcode = ${barcode}
    `;

    if (rows.length === 0) {
      return Response.json({ error: "Product not found" }, { status: 404 });
    }

    const product = rows[0];

    // Check if product cache is older than 30 days
    const updatedAt = new Date(product.updated_at);
    const now = new Date();
    const daysSinceUpdate = (now - updatedAt) / (1000 * 60 * 60 * 24);

    if (daysSinceUpdate > 30) {
      // Cache is stale, return 404 to trigger fresh fetch from OpenFoodFacts
      return Response.json({ error: "Product cache expired" }, { status: 404 });
    }

    // Convert snake_case database fields to camelCase for frontend
    const filteredProduct = {
      barcode: product.barcode,
      name: product.name,
      brand: product.brand,
      ingredients: product.ingredients,
      allergens: filterFalsePositiveAllergens(
        product.allergens,
        product.name,
        product.ingredients,
      ),
      traces: product.traces || [],
      crossContaminationWarnings: product.cross_contamination_warnings || [],
      additives_tags: product.additives_tags,
      ingredients_analysis_tags: product.ingredients_analysis_tags,
      nutritional_info: product.nutritional_info,
      image_url: product.image_url,
      updated_at: product.updated_at,
    };

    return Response.json(filteredProduct);
  } catch (error) {
    console.error("Error fetching product:", error);
    return Response.json({ error: "Failed to fetch product" }, { status: 500 });
  }
}

// Create or update product
export async function POST(request) {
  try {
    const body = await request.json();
    const {
      barcode,
      name,
      brand,
      ingredients,
      allergens,
      traces,
      crossContaminationWarnings,
      additives_tags,
      ingredients_analysis_tags,
      nutritional_info,
      image_url,
    } = body;

    if (!barcode || !name) {
      return Response.json(
        { error: "Barcode and name are required" },
        { status: 400 },
      );
    }

    // Filter allergens before saving
    const filteredAllergens = filterFalsePositiveAllergens(
      allergens,
      name,
      ingredients,
    );

    const rows = await sql`
      INSERT INTO products (
        barcode, name, brand, ingredients, allergens, traces, cross_contamination_warnings,
        additives_tags, ingredients_analysis_tags, nutritional_info, image_url, updated_at
      )
      VALUES (
        ${barcode}, ${name}, ${brand || null}, ${ingredients || null}, 
        ${filteredAllergens || []}, ${traces || []}, ${crossContaminationWarnings || []},
        ${additives_tags || []}, ${ingredients_analysis_tags || []}, 
        ${nutritional_info || null}, ${image_url || null}, NOW()
      )
      ON CONFLICT (barcode) 
      DO UPDATE SET 
        name = EXCLUDED.name,
        brand = EXCLUDED.brand,
        ingredients = EXCLUDED.ingredients,
        allergens = EXCLUDED.allergens,
        traces = EXCLUDED.traces,
        cross_contamination_warnings = EXCLUDED.cross_contamination_warnings,
        additives_tags = EXCLUDED.additives_tags,
        ingredients_analysis_tags = EXCLUDED.ingredients_analysis_tags,
        nutritional_info = EXCLUDED.nutritional_info,
        image_url = EXCLUDED.image_url,
        updated_at = NOW()
      RETURNING *
    `;

    return Response.json(rows[0]);
  } catch (error) {
    console.error("Error saving product:", error);
    return Response.json({ error: "Failed to save product" }, { status: 500 });
  }
}
