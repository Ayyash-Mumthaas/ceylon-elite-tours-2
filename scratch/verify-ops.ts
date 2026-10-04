const baseUrl = "http://localhost:3000"; // Using task-152 port

async function main() {
  console.log("Running Programmatic Verification for Checkpoint 6 (Operations)...");
  
  try {
    const res = await fetch(`${baseUrl}/api/test-ops`, { method: "POST" });
    const data = await res.json();
    
    data.logs.forEach((log: string) => console.log(log));

    if (!data.success) {
      process.exit(1);
    }
  } catch (err) {
    console.error("Failed to connect to dev server:", err);
    process.exit(1);
  }
}

main();
