import bcrypt from 'bcryptjs';

async function generateHashes() {
    // 🔑 Only your actual admin password is here now!
    const targetPassword = 'admin123'; 

    console.log("\n==================================================");
    console.log("🔒 GENERATING SYSTEM-COMPATIBLE HASH (BCRYPTJS)");
    console.log("==================================================");
    
    const freshHash = await bcrypt.hash(targetPassword, 10);
    console.log(`Password: "${targetPassword}" \n👉 Copy this hash: ${freshHash}`);
    
    console.log("==================================================\n");
}

generateHashes();