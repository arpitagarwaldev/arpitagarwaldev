// Animated Neural Network with Growing Lines
class AnimatedNeural {
    constructor() {
        this.canvas = document.createElement('canvas');
        this.canvas.id = 'animated-neural';
        this.canvas.style.position = 'fixed';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.width = '100%';
        this.canvas.style.height = '100%';
        this.canvas.style.zIndex = '0';
        this.canvas.style.pointerEvents = 'none';
        document.body.appendChild(this.canvas);

        this.ctx = this.canvas.getContext('2d');
        this.nodes = [];
        this.paths = [];
        this.init();
    }

    init() {
        this.resize();
        this.createNodes();
        this.startGrowingPaths();
        this.animate();
        window.addEventListener('resize', () => this.resize());
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = document.body.scrollHeight;
    }

    createNodes() {
        const nodeCount = Math.floor((this.canvas.width * this.canvas.height) / 60000);
        
        for (let i = 0; i < nodeCount; i++) {
            this.nodes.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                size: 2 + Math.random() * 3,
                connected: false,
                pulse: Math.random() * Math.PI * 2
            });
        }
    }

    startGrowingPaths() {
        const corners = [
            { x: 0, y: 0 },
            { x: this.canvas.width, y: 0 },
            { x: 0, y: this.canvas.height },
            { x: this.canvas.width, y: this.canvas.height }
        ];

        corners.forEach((corner, index) => {
            setTimeout(() => {
                this.growPath(corner, [], 0);
            }, index * 2000);
        });
    }

    growPath(startPoint, currentPath, depth) {
        if (depth > 10) return;

        let nearestNode = null;
        let minDistance = Infinity;

        this.nodes.forEach(node => {
            if (!node.connected) {
                const distance = Math.sqrt(
                    Math.pow(startPoint.x - node.x, 2) + 
                    Math.pow(startPoint.y - node.y, 2)
                );
                if (distance < minDistance) {
                    minDistance = distance;
                    nearestNode = node;
                }
            }
        });

        if (!nearestNode) return;

        nearestNode.connected = true;
        
        const path = {
            from: startPoint,
            to: nearestNode,
            progress: 0,
            speed: 0.03
        };

        this.paths.push(path);

        const growAnimation = () => {
            path.progress += path.speed;
            
            if (path.progress >= 1) {
                setTimeout(() => {
                    this.growPath(nearestNode, [...currentPath, path], depth + 1);
                }, 800);
            } else {
                requestAnimationFrame(growAnimation);
            }
        };

        growAnimation();
    }

    getThemeColor() {
        const scrollY = window.scrollY;
        const sections = [
            { start: 0, color: [96, 165, 250] },
            { start: window.innerHeight * 0.8, color: [59, 130, 246] },
            { start: window.innerHeight * 1.6, color: [147, 51, 234] },
            { start: window.innerHeight * 2.4, color: [34, 197, 94] },
            { start: window.innerHeight * 3.2, color: [239, 68, 68] },
            { start: window.innerHeight * 4.0, color: [245, 158, 11] }
        ];

        for (let i = sections.length - 1; i >= 0; i--) {
            if (scrollY >= sections[i].start) {
                return sections[i].color;
            }
        }
        return sections[0].color;
    }

    drawPath(path) {
        if (path.progress <= 0) return;

        const currentX = path.from.x + (path.to.x - path.from.x) * path.progress;
        const currentY = path.from.y + (path.to.y - path.from.y) * path.progress;

        // Fixed curve offset based on path coordinates (no random)
        const midX = (path.from.x + path.to.x) / 2;
        const midY = (path.from.y + path.to.y) / 2;
        const offsetX = Math.sin(path.from.x * 0.01) * 20;
        const offsetY = Math.cos(path.from.y * 0.01) * 20;

        this.ctx.beginPath();
        this.ctx.moveTo(path.from.x, path.from.y);
        
        if (path.progress < 0.5) {
            const t = path.progress * 2;
            const x = path.from.x + (midX + offsetX - path.from.x) * t;
            const y = path.from.y + (midY + offsetY - path.from.y) * t;
            this.ctx.lineTo(x, y);
        } else {
            this.ctx.quadraticCurveTo(midX + offsetX, midY + offsetY, currentX, currentY);
        }

        const themeColor = this.getThemeColor();
        const scrollY = window.scrollY;
        const isLightSection = scrollY < window.innerHeight || 
                              (scrollY > window.innerHeight * 2.4 && scrollY < window.innerHeight * 3.2) ||
                              (scrollY > window.innerHeight * 4.8);
        
        const opacity = isLightSection ? 0.6 : 0.3;
        this.ctx.strokeStyle = `rgba(${themeColor.join(',')}, ${opacity})`;
        this.ctx.lineWidth = 1.5;
        this.ctx.stroke();
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        const time = Date.now() * 0.001;
        const themeColor = this.getThemeColor();

        // Draw paths
        this.paths.forEach(path => {
            this.drawPath(path);
        });

        // Draw nodes
        this.nodes.forEach(node => {
            if (node.connected) {
                const pulseIntensity = (Math.sin(time * 2 + node.pulse) + 1) * 0.5;
                const size = node.size + pulseIntensity;
                
                const scrollY = window.scrollY;
                const isLightSection = scrollY < window.innerHeight || 
                                      (scrollY > window.innerHeight * 2.4 && scrollY < window.innerHeight * 3.2) ||
                                      (scrollY > window.innerHeight * 4.8);
                
                const nodeOpacity = isLightSection ? 0.7 + pulseIntensity * 0.2 : 0.4 + pulseIntensity * 0.2;
                
                this.ctx.beginPath();
                this.ctx.arc(node.x, node.y, size, 0, Math.PI * 2);
                this.ctx.fillStyle = `rgba(${themeColor.join(',')}, ${nodeOpacity})`;
                this.ctx.shadowBlur = 8;
                this.ctx.shadowColor = `rgba(${themeColor.join(',')}, 0.2)`;
                this.ctx.fill();
                this.ctx.shadowBlur = 0;
            }
        });

        requestAnimationFrame(() => this.animate());
    }
}

window.addEventListener('load', () => {
    new AnimatedNeural();
});