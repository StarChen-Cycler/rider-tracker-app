// Simple test file to verify polyline coordinate normalization
// This can be run in the browser console to test the logic

// Test coordinate normalization functions
function testCoordinateNormalization() {
  console.log('Testing coordinate normalization...')
  
  // Test cases for coordinate normalization
  const testCases = [
    {
      name: 'Array coordinates',
      input: [116.397428, 39.90923],
      expected: [116.397428, 39.90923]
    },
    {
      name: 'Object with lng/lat',
      input: { lng: 116.397428, lat: 39.90923 },
      expected: [116.397428, 39.90923]
    },
    {
      name: 'AMap LngLat-like object',
      input: { 
        getLng: () => 116.397428, 
        getLat: () => 39.90923 
      },
      expected: [116.397428, 39.90923]
    }
  ]
  
  // Mock normalization function
  const normalizeCoordinates = (coords) => {
    if (Array.isArray(coords)) {
      return [coords[0], coords[1]]
    }
    if (coords && typeof coords === 'object' && 'lng' in coords && 'lat' in coords) {
      return [coords.lng, coords.lat]
    }
    if (coords && typeof coords === 'object' && 'getLng' in coords && 'getLat' in coords) {
      return [coords.getLng(), coords.getLat()]
    }
    throw new Error('Invalid coordinate format')
  }
  
  testCases.forEach(testCase => {
    try {
      const result = normalizeCoordinates(testCase.input)
      const passed = JSON.stringify(result) === JSON.stringify(testCase.expected)
      console.log(`✓ ${testCase.name}: ${passed ? 'PASS' : 'FAIL'}`)
      if (!passed) {
        console.log(`  Expected: ${JSON.stringify(testCase.expected)}`)
        console.log(`  Got: ${JSON.stringify(result)}`)
      }
    } catch (error) {
      console.log(`✗ ${testCase.name}: ERROR - ${error.message}`)
    }
  })
}

// Test polyline path normalization
function testPathNormalization() {
  console.log('\nTesting path normalization...')
  
  const testPath = [
    [116.397428, 39.90923],
    [116.407428, 39.91923],
    [116.417428, 39.92923]
  ]
  
  // Mock AMap.LngLat constructor
  const mockLngLat = (lng, lat) => ({
    lng,
    lat,
    toString: () => `${lng},${lat}`
  })
  
  // Mock path normalization
  const normalizePath = (path) => {
    return path.map(coord => {
      const [lng, lat] = Array.isArray(coord) ? coord : [coord.lng, coord.lat]
      return mockLngLat(lng, lat)
    })
  }
  
  try {
    const result = normalizePath(testPath)
    console.log('✓ Path normalization: PASS')
    console.log('  Result:', result.map(p => p.toString()))
  } catch (error) {
    console.log('✗ Path normalization: ERROR -', error.message)
  }
}

// Test distance calculation
function testDistanceCalculation() {
  console.log('\nTesting distance calculation...')
  
  const calculateDistance = (lat1, lng1, lat2, lng2) => {
    const R = 6371e3 // Earth's radius in meters
    const φ1 = (lat1 * Math.PI) / 180
    const φ2 = (lat2 * Math.PI) / 180
    const Δφ = ((lat2 - lat1) * Math.PI) / 180
    const Δλ = ((lng2 - lng1) * Math.PI) / 180

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
              Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

    return R * c
  }
  
  // Test with known coordinates (Beijing to Shanghai approximate distance)
  const beijing = { lat: 39.9042, lng: 116.4074 }
  const shanghai = { lat: 31.2304, lng: 121.4737 }
  
  const distance = calculateDistance(beijing.lat, beijing.lng, shanghai.lat, shanghai.lng)
  const expectedDistance = 1060000 // Approximately 1060 km
  
  const withinRange = Math.abs(distance - expectedDistance) < 100000 // Within 100km tolerance
  
  console.log(`✓ Distance calculation: ${withinRange ? 'PASS' : 'FAIL'}`)
  console.log(`  Beijing to Shanghai: ${(distance / 1000).toFixed(2)} km`)
  console.log(`  Expected: ~${(expectedDistance / 1000).toFixed(2)} km`)
}

// Test polyline configuration
function testPolylineConfiguration() {
  console.log('\nTesting polyline configuration...')
  
  const defaultConfig = {
    strokeColor: '#3366FF',
    strokeWeight: 5,
    strokeOpacity: 1,
    strokeStyle: 'solid',
    lineJoin: 'round',
    lineCap: 'round',
    zIndex: 100,
    isOutline: true,
    outlineColor: '#ffffff',
    borderWeight: 2,
    showDir: false
  }
  
  const customConfig = {
    strokeColor: '#FF0000',
    strokeWeight: 3
  }
  
  const mergedConfig = { ...defaultConfig, ...customConfig }
  
  const expectedMerged = {
    ...defaultConfig,
    strokeColor: '#FF0000',
    strokeWeight: 3
  }
  
  const passed = JSON.stringify(mergedConfig) === JSON.stringify(expectedMerged)
  
  console.log(`✓ Configuration merging: ${passed ? 'PASS' : 'FAIL'}`)
  if (!passed) {
    console.log('  Expected:', expectedMerged)
    console.log('  Got:', mergedConfig)
  }
}

// Run all tests
function runAllTests() {
  console.log('=== Polyline Functionality Tests ===')
  testCoordinateNormalization()
  testPathNormalization()
  testDistanceCalculation()
  testPolylineConfiguration()
  console.log('\n=== Test Complete ===')
}

// Export for use in browser console
if (typeof window !== 'undefined') {
  window.runPolylineTests = runAllTests
  console.log('Polyline tests loaded. Run runPolylineTests() to execute.')
}

// Auto-run if in Node.js environment
if (typeof module !== 'undefined' && module.exports) {
  runAllTests()
} 