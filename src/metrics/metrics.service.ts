import { Injectable } from '@nestjs/common';
import { collectDefaultMetrics, Registry } from 'prom-client';

@Injectable()
export class MetricsService {
  private readonly register: Registry;

  constructor() {
    this.register = new Registry();
    // Collect default Node.js metrics
    collectDefaultMetrics({ register: this.register });
  }

  // Expose metrics as a string (for HTTP response)
  async getMetrics(): Promise<string> {
    return this.register.metrics();
  }

  // Getter for register (if you want to add custom metrics later)
  getRegister(): Registry {
    return this.register;
  }
}
