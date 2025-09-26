const bcrypt = require('bcrypt');

async function generateHashes() {
  console.log('🔐 Generating BCrypt hashes...\n');
  
  const passwords = [
    { username: 'admin', password: 'admin123' },
    { username: 'user', password: 'user123' }
  ];
  
  for (const { username, password } of passwords) {
    try {
      const hash = await bcrypt.hash(password, 10);
      console.log(`Username: ${username}`);
      console.log(`Password: ${password}`);
      console.log(`BCrypt Hash: ${hash}`);
      console.log('---');
    } catch (error) {
      console.error(`Error generating hash for ${username}:`, error);
    }
  }
  
  console.log('\n✅ Hash generation complete!');
  console.log('\n📝 Copy these hashes to your migration file if needed.');
}

generateHashes().catch(console.error);
