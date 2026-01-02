// Matrix Code Rain Effect
(function() {
  const canvas = document.getElementById('matrix-canvas');
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  
  // Set canvas size
  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);
  
  // Matrix characters - mix of Latin, numbers, and Japanese katakana
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
  const charArray = chars.split('');
  
  const fontSize = 14;
  const columns = Math.floor(canvas.width / fontSize);
  
  // Create drops array
  const drops = [];
  for (let x = 0; x < columns; x++) {
    drops[x] = Math.random() * -100;
  }
  
  // Draw function
  function draw() {
    // Semi-transparent background for trail effect
    ctx.fillStyle = 'rgba(10, 10, 10, 0.04)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = '#00ff41'; // Matrix green
    ctx.font = fontSize + 'px monospace';
    
    // Draw characters
    for (let i = 0; i < drops.length; i++) {
      const text = charArray[Math.floor(Math.random() * charArray.length)];
      
      // Calculate opacity based on position (fade effect)
      const dropY = drops[i] * fontSize;
      const opacity = Math.min(1, (canvas.height - dropY) / (fontSize * 10));
      
      ctx.fillStyle = `rgba(0, 255, 65, ${opacity})`;
      ctx.fillText(text, i * fontSize, dropY);
      
      // Reset drop to top if it reaches bottom
      if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
        drops[i] = 0;
      }
      
      // Increment drop position
      drops[i]++;
    }
  }
  
  // Animation loop
  setInterval(draw, 35);
})();

