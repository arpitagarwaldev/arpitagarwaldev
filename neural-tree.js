// Neural Network Background
class NeuralNetwork {
    constructor() {
        this.canvas = document.createElement('canvas');
        this.canvas.id = 'neural-tree';
        this.canvas.style.position = 'fixed';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.zIndex = '-1';
        this.canvas.style.opacity = '0.2';
        document.body.appendChild(this.canvas);

        this.ctx = this.canvas.getContext('2d');
        this.neurons = [];
        this.connections = [];
        this.init();
    }

    init() {
        this.resize();
        this.createNetwork();
        this.animate();
        window.addEventListener('resize', () => this.resize());
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    createNetwork() {
        this.neurons = [];
        this.connections = [];
        
        // Get portfolio sections
        const sections = ['hero', 'about', 'experience', 'patents', 'projects', 'expertise', 'achievements', 'contact'];
        
        // Create neurons for each section
        sections.forEach((sectionId, index) => {
            const element = document.getElementById(sectionId);
            if (element) {
                const rect = element.getBoundingClientRect();
                const x = (rect.left + rect.width / 2);
                const y = (rect.top + window.scrollY + rect.height / 2);
                
                this.neurons.push({
                    x: Math.max(50, Math.min(x, this.canvas.width - 50)),
                    y: Math.max(50, Math.min(y * 0.8, this.canvas.height - 50)),
                    size: 8,
                    type: 'section',
                    id: sectionId,
                    pulse: Math.random() * Math.PI * 2,
                    dendrites: []
                });
            }
        });

        // Add processing neurons
        for (let i = 0; i < 15; i++) {
            this.neurons.push({
                x: Math.random() * (this.canvas.width - 100) + 50,
                y: Math.random() * (this.canvas.height - 100) + 50,
                size: 4 + Math.random() * 3,
                type: 'processing',
                pulse: Math.random() * Math.PI * 2,
                dendrites: []
            });
        }

        this.createDendrites();
        this.createConnections();
    }

    createDendrites() {
        this.neurons.forEach(neuron => {
            const dendriteCount = neuron.type === 'section' ? 5 : 3;
            neuron.dendrites = [];
            
            for (let i = 0; i < dendriteCount; i++) {
                const angle = (Math.PI * 2 / dendriteCount) * i + Math.random() * 0.5;
                const dendrite = this.createDendriteBranch(
                    neuron.x, neuron.y, angle, 
                    neuron.type === 'section' ? 40 : 25, 0, 3
                );
                if (dendrite) neuron.dendrites.push(dendrite);
            }
        });
    }

    createDendriteBranch(x, y, angle, length, depth, maxDepth) {
        if (depth >= maxDepth) return null;
        
        const endX = x + Math.cos(angle) * length;
        const endY = y + Math.sin(angle) * length;
        
        const branch = {
            startX: x, startY: y, endX: endX, endY: endY,
            depth: depth, children: []
        };
        
        if (depth < maxDepth - 1 && Math.random() > 0.4) {
            const numChildren = Math.random() > 0.6 ? 2 : 1;
            for (let i = 0; i < numChildren; i++) {
                const newAngle = angle + (Math.random() - 0.5) * 0.8;
                const newLength = length * (0.6 + Math.random() * 0.2);
                const child = this.createDendriteBranch(endX, endY, newAngle, newLength, depth + 1, maxDepth);
                if (child) branch.children.push(child);
            }
        }
        
        return branch;
    }

    createConnections() {
        this.neurons.forEach((neuron1, i) => {
            this.neurons.forEach((neuron2, j) => {
                if (i !== j) {
                    const distance = Math.sqrt(
                        Math.pow(neuron1.x - neuron2.x, 2) + 
                        Math.pow(neuron1.y - neuron2.y, 2)
                    );
                    
                    if (distance < 200 && Math.random() > 0.8) {
                        this.connections.push({
                            from: neuron1, to: neuron2,
                            strength: Math.random() * 0.5 + 0.3,
                            pulse: Math.random() * Math.PI * 2
                        });
                    }
                }
            });
        });
    }

    drawDendrite(dendrite, opacity) {
        if (!dendrite) return;
        
        this.ctx.beginPath();
        this.ctx.moveTo(dendrite.startX, dendrite.startY);
        this.ctx.lineTo(dendrite.endX, dendrite.endY);
        
        const thickness = Math.max(0.5, 2 - dendrite.depth * 0.4);
        this.ctx.lineWidth = thickness;
        this.ctx.strokeStyle = `rgba(59, 130, 246, ${opacity * (1 - dendrite.depth * 0.2)})`;
        this.ctx.stroke();
        
        dendrite.children.forEach(child => {
            this.drawDendrite(child, opacity * 0.7);
        });
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        const time = Date.now() * 0.002;
        
        // Draw dendrites
        this.neurons.forEach(neuron => {
            neuron.dendrites.forEach(dendrite => {
                this.drawDendrite(dendrite, 0.4);
            });
        });
        
        // Draw axon connections
        this.connections.forEach(connection => {
            const pulseIntensity = (Math.sin(time * 2 + connection.pulse) + 1) * 0.5;
            const opacity = connection.strength * 0.6 * pulseIntensity;
            
            this.ctx.beginPath();
            this.ctx.moveTo(connection.from.x, connection.from.y);
            this.ctx.lineTo(connection.to.x, connection.to.y);
            this.ctx.lineWidth = 1.5;
            this.ctx.strokeStyle = `rgba(59, 130, 246, ${opacity})`;
            this.ctx.stroke();
            
            // Synaptic transmission
            const progress = (time + connection.pulse) % 3;
            if (progress < 1) {
                const synapseX = connection.from.x + (connection.to.x - connection.from.x) * progress;
                const synapseY = connection.from.y + (connection.to.y - connection.from.y) * progress;
                
                this.ctx.beginPath();
                this.ctx.arc(synapseX, synapseY, 3, 0, Math.PI * 2);
                this.ctx.fillStyle = `rgba(34, 197, 94, ${0.8 * (1 - progress)})`;
                this.ctx.fill();
            }
        });
        
        // Draw neuron cell bodies
        this.neurons.forEach(neuron => {
            const pulseIntensity = (Math.sin(time * 3 + neuron.pulse) + 1) * 0.5;
            const size = neuron.size + pulseIntensity * 2;
            
            // Cell body
            this.ctx.beginPath();
            this.ctx.arc(neuron.x, neuron.y, size, 0, Math.PI * 2);
            
            if (neuron.type === 'section') {
                this.ctx.fillStyle = `rgba(34, 197, 94, ${0.6 + pulseIntensity * 0.3})`;
            } else {
                this.ctx.fillStyle = `rgba(59, 130, 246, ${0.5 + pulseIntensity * 0.2})`;
            }
            this.ctx.fill();
            
            // Nucleus
            this.ctx.beginPath();
            this.ctx.arc(neuron.x, neuron.y, size * 0.4, 0, Math.PI * 2);
            this.ctx.fillStyle = `rgba(255, 255, 255, ${0.8 + pulseIntensity * 0.2})`;
            this.ctx.fill();
        });

        requestAnimationFrame(() => this.animate());
    }
}

window.addEventListener('load', () => {
    new NeuralNetwork();
});