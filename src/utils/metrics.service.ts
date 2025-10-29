import { Injectable } from '@nestjs/common';
import { Registry, register } from 'prom-client';

@Injectable()
export class MetricsService {
  private registry: Registry;

  constructor() {
    this.registry = register;
    // Clear the default registry
    this.registry.clear();
  }

  getRegister(): Registry {
    return this.registry;
  }
}