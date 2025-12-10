// Simple test runner to verify BaseBuilder works
const { BaseBuilder } = await import('./src/base/BaseBuilder.ts');

class TestBuilder extends BaseBuilder {
  render() {
    return null;
  }
}

console.log('Running BaseBuilder tests...\n');

let passed = 0;
let failed = 0;

// Test 1: Create instance
try {
  const builder = new TestBuilder();
  if (builder) {
    console.log(' should create an instance');
    passed++;
  }
} catch (e) {
  console.log(' should create an instance');
  console.error(e);
  failed++;
}

// Test 2: Set key
try {
  const builder = new TestBuilder();
  builder.key('testKey');
  if (builder['_key'] === 'testKey') {
    console.log(' should set key');
    passed++;
  } else {
    throw new Error('Key not set correctly');
  }
} catch (e) {
  console.log(' should set key');
  console.error(e);
  failed++;
}

// Test 3: Set disabled
try {
  const builder = new TestBuilder();
  builder.disabled(true);
  if (builder['_config'].disabled === true) {
    console.log(' should set disabled');
    passed++;
  } else {
    throw new Error('Disabled not set correctly');
  }
} catch (e) {
  console.log(' should set disabled');
  console.error(e);
  failed++;
}

// Test 4: Set hidden
try {
  const builder = new TestBuilder();
  builder.hidden(true);
  if (builder['_config'].hidden === true) {
    console.log(' should set hidden');
    passed++;
  } else {
    throw new Error('Hidden not set correctly');
  }
} catch (e) {
  console.log(' should set hidden');
  console.error(e);
  failed++;
}

// Test 5: Method chaining
try {
  const builder = new TestBuilder();
  const result = builder.key('test').disabled(true).hidden(false);
  if (result === builder) {
    console.log(' should support method chaining');
    passed++;
  } else {
    throw new Error('Method chaining not working');
  }
} catch (e) {
  console.log(' should support method chaining');
  console.error(e);
  failed++;
}

console.log(`\nResults: ${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
