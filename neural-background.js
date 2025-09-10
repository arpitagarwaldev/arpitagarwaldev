// Beautiful Neural Network Background
class NeuralBackground {
    constructor() {
        this.canvas = document.createElement('canvas');
        this.canvas.id = 'neural-bg';
        this.canvas.style.position = 'fixed';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.width = '100%';
        this.canvas.style.height = '100%';
        this.canvas.style.zIndex = '-1';
        this.canvas.style.pointerEvents = 'none';
        document.body.appendChild(this.canvas);

        this.ctx = this.canvas.getContext('2d');
        this.neurons = [];
        this.connections = [];
        this.init();
    }

    init() {
        this.resize();
        this.createNeurons();
        this.animate();
        window.addEventListener('resize', () => this.resize());
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = document.body.scrollHeight;
    }

    createNeurons() {
        const neuronCount = Math.floor((this.canvas.width * this.canvas.height) / 25000);
        
        for (let i = 0; i < neuronCount; i++) {
            this.neurons.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                size: 3 + Math.random() * 4,
                pulse: Math.random() * Math.PI * 2,
                speed: 0.01 + Math.random() * 0.02,
                connected: false
            });
        }

        this.createNeuralPathway();
    }

    createNeuralPathway() {
        if (this.neurons.length === 0) return;
        
        let currentNeuron = this.neurons[Math.floor(Math.random() * this.neurons.length)];
        currentNeuron.connected = true;
        
        this.growPathway(currentNeuron, 0, 8);
    }

    growPathway(fromNeuron, depth, maxDepth) {
        if (depth >= maxDepth) return;
        
        const nearbyNeurons = this.neurons.filter(neuron => {
            if (neuron.connected) return false;
            const distance = Math.sqrt(
                Math.pow(fromNeuron.x - neuron.x, 2) + 
                Math.pow(fromNeuron.y - neuron.y, 2)
            );
            return distance < 300;
        });
        
        if (nearbyNeurons.length === 0) return;
        
        const connectCount = Math.min(1 + Math.floor(Math.random() * 2), nearbyNeurons.length);
        
        for (let i = 0; i < connectCount; i++) {
            const targetNeuron = nearbyNeurons[Math.floor(Math.random() * nearbyNeurons.length)];
            if (targetNeuron.connected) continue;
            
            targetNeuron.connected = true;
            
            this.connections.push({
                from: fromNeuron,
                to: targetNeuron,
                strength: Math.random() * 0.6 + 0.4
            });
            
            this.growPathway(targetNeuron, depth + 1, maxDepth);
        }
    }

    getThemeColor() {
        const scrollY = window.scrollY;
        const sections = [
            { start: 0, color: [37, 99, 235] }, // Hero - Blue
            { start: window.innerHeight * 0.8, color: [59, 130, 246] }, // About - Light Blue
            { start: window.innerHeight * 1.6, color: [147, 51, 234] }, // Experience - Purple
            { start: window.innerHeight * 2.4, color: [34, 197, 94] }, // Patents - Green
            { start: window.innerHeight * 3.2, color: [239, 68, 68] }, // Projects - Red
            { start: window.innerHeight * 4.0, color: [245, 158, 11] }, // Expertise - Orange
            { start: window.innerHeight * 4.8, color: [168, 85, 247] }, // Achievements - Violet
            { start: window.innerHeight * 5.6, color: [20, 184, 166] }  // Contact - Teal
        ];

        for (let i = sections.length - 1; i >= 0; i--) {
            if (scrollY >= sections[i].start) {
                return sections[i].color;
            }
        }
        return sections[0].color;
    }

    drawCurvyConnection(from, to, opacity) {
        const dx = to.x - from.x;
        const dy = to.y - from.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        const segments = Math.max(3, Math.floor(distance / 50));
        const curviness = 0.3;
        
        this.ctx.beginPath();
        this.ctx.moveTo(from.x, from.y);
        
        for (let i = 1; i <= segments; i++) {
            const t = i / segments;
            const baseX = from.x + dx * t;
            const baseY = from.y + dy * t;
            
            const perpX = -dy / distance;
            const perpY = dx / distance;
            
            const waveOffset = Math.sin(t * Math.PI * 2) * curviness * distance * 0.1;
            const randomOffset = (Math.random() - 0.5) * 20;
            
            const finalX = baseX + perpX * (waveOffset + randomOffset);
            const finalY = baseY + perpY * (waveOffset + randomOffset);
            
            if (i === segments) {
                this.ctx.lineTo(to.x, to.y);
            } else {
                this.ctx.lineTo(finalX, finalY);
            }
        }
        
        this.ctx.lineWidth = 2;
        this.ctx.strokeStyle = `rgba(${this.getThemeColor().join(',')}, ${opacity})`;
        this.ctx.stroke();
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        const time = Date.now() * 0.001;
        const themeColor = this.getThemeColor();

        // Draw connections
        this.connections.forEach(connection => {
            const pulseIntensity = (Math.sin(time * 2) + 1) * 0.5;
            const opacity = connection.strength * 0.8 * pulseIntensity;
            this.drawCurvyConnection(connection.from, connection.to, opacity);
        });

        // Draw neurons
        this.neurons.forEach(neuron => {
            neuron.pulse += neuron.speed;
            const pulseIntensity = (Math.sin(neuron.pulse) + 1) * 0.5;
            const size = neuron.size + pulseIntensity * 1.5;
            
            // Neuron body
            this.ctx.beginPath();
            this.ctx.arc(neuron.x, neuron.y, size, 0, Math.PI * 2);
            this.ctx.fillStyle = `rgba(${themeColor.join(',')}, ${0.8 + pulseIntensity * 0.2})`;
            this.ctx.fill();
            
            // Neuron nucleus
            this.ctx.beginPath();
            this.ctx.arc(neuron.x, neuron.y, size * 0.4, 0, Math.PI * 2);
            this.ctx.fillStyle = `rgba(255, 255, 255, ${0.9 + pulseIntensity * 0.1})`;
            this.ctx.fill();
        });

        requestAnimationFrame(() => this.animate());
    }
}

window.addEventListener('load', () => {
    new NeuralBackground();
});