function (pixelCount) {
  // LED Lamp 3D Mapping for Pixel Blaze
  // 8-legged circular lamp with 26° splay angle
  // Each leg has 44 LEDs in a 1-foot strip
  // Lamp expands downward from a 5-inch hub at the top
  
  const NUM_LEGS = 8;
  const SPLAY_ANGLE = 26 * Math.PI / 180; // Convert to radians
  const STRIP_LENGTH = 1.0; // feet
  const LEDS_PER_STRIP = 44;
  const LED_SPACING = STRIP_LENGTH / (LEDS_PER_STRIP - 1);
  const HUB_RADIUS = 2.5 / 12; // 5 inches diameter = 2.5 inch radius, converted to feet
  
  var map = [];
  
  for (let leg = 0; leg < NUM_LEGS; leg++) {
    // Calculate leg angle (each leg is 360/num_legs degrees apart)
    const legAngle = 2 * Math.PI * leg / NUM_LEGS;
    
    // Calculate the direction vector for this leg
    // Legs splay out at splay_angle from vertical (pointing downward)
    const legDirectionX = Math.sin(SPLAY_ANGLE) * Math.cos(legAngle);
    const legDirectionY = Math.sin(SPLAY_ANGLE) * Math.sin(legAngle);
    const legDirectionZ = -Math.cos(SPLAY_ANGLE); // Negative Z for downward direction
    
    // Calculate LED positions along this leg
    for (let led = 0; led < LEDS_PER_STRIP; led++) {
      // Distance along the leg (0 to strip_length)
      const distance = led * LED_SPACING;
      
      // Calculate 3D position
      // Start from hub position, then extend along leg direction
      const hubX = HUB_RADIUS * Math.cos(legAngle);
      const hubY = HUB_RADIUS * Math.sin(legAngle);
      const hubZ = 0; // Hub is at the top (Z = 0)
      
      const x = hubX + legDirectionX * distance;
      const y = hubY + legDirectionY * distance;
      const z = hubZ + legDirectionZ * distance;
      
      map.push([x, y, z]);
    }
  }
  
  // Normalize coordinates to fit within -1 to 1 range for Pixel Blaze
  let maxX = 0, maxY = 0, maxZ = 0;
  map.forEach(pos => {
    maxX = Math.max(maxX, Math.abs(pos[0]));
    maxY = Math.max(maxY, Math.abs(pos[1]));
    maxZ = Math.max(maxZ, Math.abs(pos[2]));
  });
  
  const maxExtent = Math.max(maxX, maxY, maxZ);
  
  // Normalize coordinates
  map = map.map(pos => [
    pos[0] / maxExtent,
    pos[1] / maxExtent,
    pos[2] / maxExtent
  ]);
  
  return map;
}
