// src/app/login/login.component.ts
import { AfterViewInit, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../shared/material';

interface Balloon {
  left: number;
  delay: number;
  color: string;
}

class Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life = 1;
  color: string;
  constructor(x: number, y: number, vx: number, vy: number, color: string) {
    this.x = x; this.y = y;
    this.vx = vx; this.vy = vy;
    this.color = color;
  }
  update(ctx: CanvasRenderingContext2D) {
    this.life -= 0.02;
    this.x += this.vx;
    this.y += this.vy;
    this.vy += 0.05; // gravedad
    ctx.globalAlpha = this.life;
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
  }
}

class Firework {
  particles: Particle[] = [];
  constructor(
    public x: number,
    public y: number,
    count: number,
    hue: number
  ) {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 3 + 2;
      const color = `hsl(${hue}, 100%, 50%)`;
      this.particles.push(
        new Particle(
          x,
          y,
          Math.cos(angle) * speed,
          Math.sin(angle) * speed,
          color
        )
      );
    }
  }
  update(ctx: CanvasRenderingContext2D) {
    this.particles.forEach(p => p.update(ctx));
    this.particles = this.particles.filter(p => p.life > 0);
    return this.particles.length > 0;
  }
}


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MaterialModule
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, AfterViewInit {
  @ViewChild('canvas', { static: true })
  canvas!: ElementRef<HTMLCanvasElement>;
  ctx!: CanvasRenderingContext2D;
  fireworks: Firework[] = [];

  splash = '¡Feliz Cumpleaños Thay!';
  message = 'Amiga mía, en el día que naciste hasta los bosques de Lordaeron susurraron tu nombre... Thay. Amiga querida, contemplé con orgullo cómo te convertías en una bella persona. Recuerda que nuestro lazo siempre se ha guiado por la amistad y la confianza... Y sé que mostrarás moderación en el ejercicio de tu gran corazón. Pero la verdadera victoria, amiga mía, está en tocar las almas de quienes te rodean. Te digo todo esto, porque llegaran días bellos a tu vida... en el cual tú serás muy feliz.';
  splashChars: string[] = [];
  messageChars: string[] = [];

  showMessage = false;
  showBalloons = false;
  balloons: Balloon[] = [];

  ngOnInit() {
    this.splashChars = Array.from(this.splash);
    this.messageChars = Array.from(this.message);

    const splashDur = this.splashChars.length * 80 + 400;
    const msgDur = this.messageChars.length * 80 + 400;

    setTimeout(() => {
      this.showMessage = true;
      setTimeout(() => {
        this.showBalloons = true;
        this.launchBalloons();
      }, msgDur);
    }, splashDur);
  }

  ngAfterViewInit() {
    const c = this.canvas.nativeElement;
    c.width = window.innerWidth;
    c.height = window.innerHeight;
    this.ctx = c.getContext('2d')!;
    window.addEventListener('resize', () => {
      c.width = window.innerWidth;
      c.height = window.innerHeight;
    });
    this.animate();
  }

  private animate() {
    requestAnimationFrame(() => this.animate());
    const { width, height } = this.canvas.nativeElement;
    // capa semitransparente para el rastro
    this.ctx.fillStyle = 'rgba(0,0,0,0.2)';
    this.ctx.fillRect(0, 0, width, height);

    // lanzar fuego al azar
    if (Math.random() < 0.05) {
      this.fireworks.push(
        new Firework(
          Math.random() * width,
          Math.random() * height * 0.6 + height * 0.2,
          80,
          Math.random() * 360
        )
      );
    }

    // actualizar y dibujar
    this.fireworks = this.fireworks.filter(fw =>
      fw.update(this.ctx)
    );
  }

  private launchBalloons() {
    this.balloons = Array.from({ length: 8 }, () => ({
      left: Math.random() * 80 + 10,
      delay: Math.random() * 2000,
      color:
        Math.random() > 0.5
          ? 'radial-gradient(circle at 30% 30%, #ff4757, #c0392b)'
          : 'radial-gradient(circle at 30% 30%, #2ecc71, #27ae60)'
    }));
  }
}