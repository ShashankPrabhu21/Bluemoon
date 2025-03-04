import db from "../../../../lib/db";  



export async function POST(req) {
  try {
    const body = await req.json();
    console.log("Received data:", body);

    const { name, email, phone, subject, message } = body;

    if (!name || !email || !message) {
      console.log("Validation failed: Missing required fields");
      return new Response("Missing required fields", { status: 400 });
    }

    const query = `
      INSERT INTO contact_messages (name, email, phone, subject, message)
      VALUES (?, ?, ?, ?, ?)
    `;
    const values = [name, email, phone, subject, message];

    await new Promise((resolve, reject) => {
      db.query(query, values, (err, result) => {
        if (err) {
          console.error("Database error:", err);
          return reject(err);
        }
        console.log("Data inserted successfully:", result);
        resolve();
      });
    });

    return new Response("Message saved successfully", { status: 200 });
  } catch (error) {
    console.error("Database error:", error);
    return new Response("Database error", { status: 500 });
  }
}