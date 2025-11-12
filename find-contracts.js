/**
 * Quick Script to Find Sport.Fun Contract Addresses
 * 
 * Run this in the browser console while on pro.football.fun
 * It will search for contract addresses in the page
 */

console.log('🔍 Searching for Sport.Fun contract addresses...');

// Search for contract addresses in window object
function findContracts() {
  const contracts = [];
  const addressPattern = /0x[a-fA-F0-9]{40}/g;

  // Search in window object
  function searchObject(obj, path = 'window') {
    try {
      for (const key in obj) {
        if (key.includes('contract') || key.includes('address') || key.includes('Contract')) {
          const value = obj[key];
          if (typeof value === 'string' && addressPattern.test(value)) {
            contracts.push({ path: `${path}.${key}`, value });
          } else if (typeof value === 'object' && value !== null) {
            searchObject(value, `${path}.${key}`);
          }
        }
      }
    } catch (e) {
      // Ignore access errors
    }
  }

  // Search window
  searchObject(window);

  // Search localStorage
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      const value = localStorage.getItem(key);
      if (value && addressPattern.test(value)) {
        contracts.push({ path: `localStorage.${key}`, value });
      }
    }
  } catch (e) {}

  // Search sessionStorage
  try {
    for (let i = 0; i < sessionStorage.length; i++) {
      const key = sessionStorage.key(i);
      const value = sessionStorage.getItem(key);
      if (value && addressPattern.test(value)) {
        contracts.push({ path: `sessionStorage.${key}`, value });
      }
    }
  } catch (e) {}

  // Search in network responses (if available)
  console.log('📡 Tip: Check Network tab in DevTools for API responses with contract addresses');

  return contracts;
}

// Run search
const found = findContracts();

if (found.length > 0) {
  console.log('✅ Found potential contract addresses:');
  found.forEach(({ path, value }) => {
    console.log(`  ${path}: ${value}`);
  });
} else {
  console.log('❌ No contract addresses found in page');
  console.log('💡 Try these methods:');
  console.log('  1. Check Network tab → Look for API calls');
  console.log('  2. Check Dune Analytics queries');
  console.log('  3. Inspect a transaction on PolygonScan');
  console.log('  4. Check Sport.Fun documentation');
}

// Also check for ethereum provider
if (window.ethereum) {
  console.log('\n✅ Web3 provider detected (MetaMask, etc.)');
  console.log('💡 Try: window.ethereum.request({ method: "eth_chainId" }) to get chain ID');
}

// Check for common contract variable names
const commonNames = [
  'CONTRACT_ADDRESS',
  'MARKETPLACE_ADDRESS',
  'SHARES_ADDRESS',
  'NFT_ADDRESS',
  'TOKEN_ADDRESS',
];

console.log('\n🔍 Searching for common contract variable names...');
commonNames.forEach(name => {
  if (window[name]) {
    console.log(`  Found: ${name} = ${window[name]}`);
  }
});

console.log('\n📝 Next steps:');
console.log('  1. Copy any addresses found above');
console.log('  2. Add them to .env file');
console.log('  3. Get ABIs from PolygonScan/Etherscan');
console.log('  4. Update src/lib/web3.ts');

